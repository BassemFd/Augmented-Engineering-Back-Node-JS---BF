import { describe, it, expect, beforeEach } from 'vitest';
import {
  TransferTokensUseCase,
  TransferRecord,
  InsufficientTokensException,
  RateLimitExceededException,
} from '../transfer-tokens.use-case';

type TokenAmount = { drink: number; food: number };

class FakeTokenRepository {
  private store = new Map<string, TokenAmount>();

  seed(userId: string, tokens: TokenAmount) {
    this.store.set(userId, tokens);
  }

  async getTokens(userId: string): Promise<TokenAmount> {
    return this.store.get(userId) ?? { drink: 0, food: 0 };
  }

  setTokens(userId: string, tokens: TokenAmount) {
    this.store.set(userId, tokens);
  }
}

class FakeTransferRepository {
  public records: TransferRecord[] = [];
  private recentCountOverride: number | null = null;

  setRecentCountOverride(count: number) {
    this.recentCountOverride = count;
  }

  recordTransfer(record: TransferRecord) {
    this.records.push(record);
  }

  getRecentTransferCount(senderId: string, _since: Date): number {
    if (this.recentCountOverride !== null) return this.recentCountOverride;
    return this.records.filter(r => r.senderId === senderId).length;
  }
}

describe('TransferTokensUseCase', () => {
  let tokenRepo: FakeTokenRepository;
  let transferRepo: FakeTransferRepository;
  let useCase: TransferTokensUseCase;

  beforeEach(() => {
    tokenRepo = new FakeTokenRepository();
    transferRepo = new FakeTransferRepository();
    useCase = new TransferTokensUseCase(tokenRepo, transferRepo);
  });

  it('given two users with drink token balances, when user A transfers 3 drink tokens to user B, then A balance decreases and B balance increases and a transfer record is created', async () => {
    // Given
    tokenRepo.seed('user-a', { drink: 10, food: 5 });
    tokenRepo.seed('user-b', { drink: 2, food: 0 });

    // When
    const result = await useCase.execute({
      senderId: 'user-a',
      receiverId: 'user-b',
      amount: 3,
      tokenType: 'drink',
    });

    // Then
    expect(result.status).toBe('TRANSFERRED');
    expect(result.senderBalance).toMatchObject({ drink: 7, food: 5 });
    expect(result.receiverBalance).toMatchObject({ drink: 5, food: 0 });
    expect(transferRepo.records).toHaveLength(1);
    expect(transferRepo.records[0]).toMatchObject({
      senderId: 'user-a',
      receiverId: 'user-b',
      amount: 3,
      tokenType: 'drink',
    });
    expect(transferRepo.records[0].timestamp).toBeInstanceOf(Date);
  });

  it('given user A has 2 food tokens, when user A tries to transfer 5 food tokens to user B, then the transfer is rejected with InsufficientTokensException', async () => {
    // Given
    tokenRepo.seed('user-a', { drink: 0, food: 2 });
    tokenRepo.seed('user-b', { drink: 0, food: 0 });

    // When / Then
    await expect(
      useCase.execute({ senderId: 'user-a', receiverId: 'user-b', amount: 5, tokenType: 'food' })
    ).rejects.toThrow(InsufficientTokensException);

    expect(transferRepo.records).toHaveLength(0);
  });

  it('given user A has already made 10 transfers in the last hour, when user A tries another transfer, then the transfer is rejected with RateLimitExceededException', async () => {
    // Given
    tokenRepo.seed('user-a', { drink: 100, food: 100 });
    tokenRepo.seed('user-b', { drink: 0, food: 0 });
    transferRepo.setRecentCountOverride(10);

    // When / Then
    await expect(
      useCase.execute({ senderId: 'user-a', receiverId: 'user-b', amount: 1, tokenType: 'drink' })
    ).rejects.toThrow(RateLimitExceededException);
  });

  it('given user A transfers food tokens, when transfer succeeds, then only the food balance changes and drink balances remain untouched', async () => {
    // Given
    tokenRepo.seed('user-a', { drink: 5, food: 8 });
    tokenRepo.seed('user-b', { drink: 3, food: 1 });

    // When
    const result = await useCase.execute({
      senderId: 'user-a',
      receiverId: 'user-b',
      amount: 4,
      tokenType: 'food',
    });

    // Then
    expect(result.senderBalance).toMatchObject({ drink: 5, food: 4 });
    expect(result.receiverBalance).toMatchObject({ drink: 3, food: 5 });
  });
});

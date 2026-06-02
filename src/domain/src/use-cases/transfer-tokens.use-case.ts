import { TokenRepository, TokenAmount } from './token-summary.use-case.ts';

export type TokenType = 'drink' | 'food';

export interface TransferRecord {
  senderId: string;
  receiverId: string;
  amount: number;
  tokenType: TokenType;
  timestamp: Date;
}

export interface TransferRepository {
  recordTransfer(transfer: TransferRecord): Promise<void> | void;
  getRecentTransferCount(senderId: string, since: Date): Promise<number> | number;
}

export class InsufficientTokensException extends Error {
  constructor() {
    super('INSUFFICIENT_TOKENS');
    this.name = 'InsufficientTokensException';
  }
}

export class RateLimitExceededException extends Error {
  constructor() {
    super('RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitExceededException';
  }
}

export interface TransferTokensResult {
  status: string;
  senderBalance: TokenAmount;
  receiverBalance: TokenAmount;
  transferId: string;
}

export class TransferTokensUseCase {
  private static readonly RATE_LIMIT_MAX = 10;
  private static readonly RATE_LIMIT_WINDOW_MS = 3600 * 1000;

  constructor(
    private tokenRepo: TokenRepository,
    private transferRepo: TransferRepository,
  ) {}

  async execute({
    senderId,
    receiverId,
    amount,
    tokenType,
  }: {
    senderId: string;
    receiverId: string;
    amount: number;
    tokenType: TokenType;
  }): Promise<TransferTokensResult> {
    const windowStart = new Date(Date.now() - TransferTokensUseCase.RATE_LIMIT_WINDOW_MS);
    const recentCount = await this.transferRepo.getRecentTransferCount(senderId, windowStart);
    if (recentCount >= TransferTokensUseCase.RATE_LIMIT_MAX) {
      throw new RateLimitExceededException();
    }

    const senderTokens = await this.tokenRepo.getTokens(senderId);
    if (senderTokens[tokenType] < amount) {
      throw new InsufficientTokensException();
    }

    const receiverTokens = await this.tokenRepo.getTokens(receiverId);

    const newSenderBalance: TokenAmount = { ...senderTokens, [tokenType]: senderTokens[tokenType] - amount };
    const newReceiverBalance: TokenAmount = { ...receiverTokens, [tokenType]: receiverTokens[tokenType] + amount };

    await this.tokenRepo.setTokens(senderId, newSenderBalance);
    await this.tokenRepo.setTokens(receiverId, newReceiverBalance);

    const timestamp = new Date();
    const transferId = `${senderId}-${receiverId}-${timestamp.getTime()}`;

    await this.transferRepo.recordTransfer({ senderId, receiverId, amount, tokenType, timestamp });

    return { status: 'TRANSFERRED', senderBalance: newSenderBalance, receiverBalance: newReceiverBalance, transferId };
  }
}

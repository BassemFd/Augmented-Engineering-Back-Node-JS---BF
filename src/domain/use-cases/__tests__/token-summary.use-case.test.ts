import { describe, it, expect } from 'vitest';
import { TokenSummaryUseCase, TokenRepository, TokenAmount } from '../token-summary.use-case';

// Domain-style lightweight fakes and a placeholder use-case to produce a clean Red failure
class FakeTokenRepository implements TokenRepository {
  private store = new Map<string, TokenAmount>();

  setTokens(customerId: string, tokens: TokenAmount) {
    this.store.set(customerId, tokens);
  }

  getTokens(customerId: string): TokenAmount {
    return this.store.get(customerId) ?? { drink: 0, food: 0 };
  }
}

// Placeholder for the production use-case. Intentionally throws to produce a clear Red failure.
describe('TokenSummaryUseCase', () => {
  it('given a festival goer has 5 drink tokens, when requesting a token summary for this customer, then the domain returns drinkTokens=5 and foodTokens=0', async () => {
    // Given
    const fakeRepo = new FakeTokenRepository();
    fakeRepo.setTokens('cust-1', { drink: 5, food: 0 });

    // use-case placeholder (production missing)
    const useCase = new TokenSummaryUseCase(fakeRepo);

    // When
    const result = await useCase.execute('cust-1');

    // Then
    expect(result).toMatchObject({ drinkTokens: 5, foodTokens: 0 });
  });

  it('given a festival goer has no token balance record, when requesting a token summary for this customer, then the domain returns drinkTokens=0 and foodTokens=0', async () => {
    // Given
    const fakeRepo = new FakeTokenRepository();

    // no tokens set for this customer -> simulates "no record"
    const useCase = new TokenSummaryUseCase(fakeRepo);

    // When
    const result = await useCase.execute('cust-no-record');

    // Then
    expect(result).toMatchObject({ drinkTokens: 0, foodTokens: 0 });
  });

  it('given a token repository returns drinkTokens=-2 and foodTokens=-1 for a customer, when requesting a token summary, then the domain returns drinkTokens=0 and foodTokens=0 (clamped)', async () => {
    // Given
    const fakeRepo = new FakeTokenRepository();
    fakeRepo.setTokens('cust-neg', { drink: -2, food: -1 });

    // use-case (production currently returns raw values)
    const useCase = new TokenSummaryUseCase(fakeRepo);

    // When
    const result = await useCase.execute('cust-neg');

    // Then
    expect(result).toMatchObject({ drinkTokens: 0, foodTokens: 0 });
  });
});

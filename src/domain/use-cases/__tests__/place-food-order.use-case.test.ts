import { describe, it, expect } from 'vitest';
import { PlaceFoodOrderUseCase } from '../place-food-order.use-case';

// Lightweight in-test fakes to isolate the domain behaviour for Red step
type TokenAmount = { drink: number; food: number };

class FakeTokenRepository {
  private store = new Map<string, TokenAmount>();

  setTokens(customerId: string, tokens: TokenAmount) {
    this.store.set(customerId, tokens);
  }

  async getTokens(customerId: string): Promise<TokenAmount> {
    return this.store.get(customerId) ?? { drink: 0, food: 0 };
  }
}

// Use production implementation from domain package

describe('PlaceFoodOrderUseCase', () => {
  it('given a festival goer with 7 food tokens, when ordering 1 snack and 2 meals, then order is confirmed and remaining food tokens is 0', async () => {
    // Given
    const fakeTokenRepo = new FakeTokenRepository();
    fakeTokenRepo.setTokens('cust-1', { drink: 0, food: 7 });

    // costs: snack=1, meal=3
    const useCase = new PlaceFoodOrderUseCase(fakeTokenRepo);

    // When / Then: expect confirmation and zero remaining food tokens
    await expect(
      useCase.execute({
        customerId: 'cust-1',
        items: [
          { name: 'snack', quantity: 1, cost: 1 },
          { name: 'meal', quantity: 2, cost: 3 },
        ],
      })
    ).resolves.toMatchObject({ status: 'CONFIRMED', remainingFoodTokens: 0 });
  });
});

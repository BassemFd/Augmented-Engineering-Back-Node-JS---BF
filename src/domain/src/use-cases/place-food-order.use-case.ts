import { TokenRepository, TokenAmount } from './token-summary.use-case.ts';

export type FoodItem = { name: string; quantity: number; cost: number };

export class PlaceFoodOrderUseCase {
  private tokenRepo: TokenRepository;

  constructor(tokenRepo: TokenRepository) {
    this.tokenRepo = tokenRepo;
  }

  async execute({ customerId, items }: { customerId: string; items: FoodItem[] }): Promise<{ status: string; remainingFoodTokens: number }> {
    const totalCost = items.reduce((acc, it) => acc + it.cost * it.quantity, 0);

    const tokens = await this.tokenRepo.getTokens(customerId);
    const remainingFood = tokens.food - totalCost;

    await this.tokenRepo.setTokens(customerId, { drink: tokens.drink, food: remainingFood } as TokenAmount);

    return { status: 'CONFIRMED', remainingFoodTokens: remainingFood };
  }
}

// (no additional aliases required)

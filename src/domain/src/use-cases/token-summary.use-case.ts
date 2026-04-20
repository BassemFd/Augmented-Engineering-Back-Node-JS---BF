export type TokenAmount = { drink: number; food: number };

export interface TokenRepository {
  getTokens(customerId: string): Promise<TokenAmount> | TokenAmount;
}

export class TokenSummaryUseCase {
  constructor(private tokenRepo: TokenRepository) {}

  async execute(customerId: string): Promise<{ drinkTokens: number; foodTokens: number }> {
    const tokens = await this.tokenRepo.getTokens(customerId);
    const drink = Math.max(0, tokens?.drink ?? 0);
    const food = Math.max(0, tokens?.food ?? 0);
    return { drinkTokens: drink, foodTokens: food };
  }
}

// file intentionally exports TokenSummaryUseCase via its declaration above

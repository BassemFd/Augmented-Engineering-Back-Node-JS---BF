import { describe, it, expect, beforeEach } from 'vitest';
import { CancelOrderUseCase, IOrderRepository, ITokenService, Order } from '../cancel-order.use-case';

class FakeOrderRepository implements IOrderRepository {
  private orders = new Map<string, Order>();

  add(order: Order) {
    const id = `order-${this.orders.size + 1}`;
    order.id = id;
    this.orders.set(id, order);
    return order;
  }

  async findById(id: string) {
    return this.orders.get(id) ?? null;
  }

  save(order: Order) {
    if (!order.id) {
      order.id = `order-${this.orders.size + 1}`;
    }
    this.orders.set(order.id, order);
    return order;
  }
}

class FakeTokenService implements ITokenService {
  public refunded: { customerId: string; tokens: { drink: number; food: number } } | null = null;

  refundTokens(customerId: string, tokens: { drink: number; food: number }) {
    this.refunded = { customerId, tokens };
  }
}

describe('CancelOrderUseCase', () => {
  let fakeOrderRepository: FakeOrderRepository;
  let fakeTokenService: FakeTokenService;
  // use the real production use-case
  let useCase: CancelOrderUseCase;

  beforeEach(() => {
    fakeOrderRepository = new FakeOrderRepository();
    fakeTokenService = new FakeTokenService();
    useCase = new CancelOrderUseCase(fakeOrderRepository as unknown as IOrderRepository, fakeTokenService as unknown as ITokenService);
  });

  it('given an unacknowledged order reserved 2 drink tokens and 1 food token, when the festival goer cancels the order, then order status becomes canceled and tokens refunded', async () => {
    // Given
    const saved = fakeOrderRepository.add({ customerId: 'cust-1', status: 'UNACKNOWLEDGED', reservedTokens: { drink: 2, food: 1 } });

    // When
    // We attempt to execute and assert expected outcome
    const result = await useCase.execute(saved.id as string);

    // Then
    expect(result).toBeDefined();
    expect(result.status).toBe('CANCELED');
    expect(fakeTokenService.refunded).toMatchObject({ customerId: 'cust-1', tokens: { drink: 2, food: 1 } });
  });

  it('given an order has already been acknowledged by the bartender, when the festival goer cancels the order, then the cancellation is rejected and order status remains acknowledged', async () => {
    // Given
    const saved = fakeOrderRepository.add({ customerId: 'cust-1', status: 'ACKNOWLEDGED', reservedTokens: { drink: 1, food: 0 } });

    // When / Then
    await expect(useCase.execute(saved.id as string)).rejects.toThrow('ORDER_ACKNOWLEDGED');
    expect(fakeTokenService.refunded).toBeNull();
  });
});

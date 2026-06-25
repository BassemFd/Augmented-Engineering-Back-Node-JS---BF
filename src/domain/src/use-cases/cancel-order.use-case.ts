// Domain types and interfaces for cancel order (minimal placeholder)
export type TokenAmount = { drink: number; food: number };
export type Order = { id?: string; customerId: string; status: string; reservedTokens: TokenAmount };

export interface IOrderRepository {
  findById(id: string): Promise<Order | null> | Order | null;
  save(order: Order): Order;
}

export interface ITokenService {
  refundTokens(customerId: string, tokens: TokenAmount): void;
}

export class OrderAcknowledgedException extends Error {
  constructor() {
    super('ORDER_ACKNOWLEDGED');
    this.name = 'OrderAcknowledgedException';
  }
}

// Minimal placeholder use case implementation — intentionally not implemented for Red step
export class CancelOrderUseCase {
  private orderRepo: IOrderRepository;
  private tokenService: ITokenService;

  constructor(orderRepo: IOrderRepository, tokenService: ITokenService) {
    this.orderRepo = orderRepo;
    this.tokenService = tokenService;
  }

  async execute(orderId: string): Promise<{ orderId: string; status: string }> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('ORDER_NOT_FOUND');
    if (order.status !== 'UNACKNOWLEDGED') throw new OrderAcknowledgedException();

    // refund tokens to customer
    this.tokenService.refundTokens(order.customerId, order.reservedTokens);

    order.status = 'CANCELED';
    this.orderRepo.save(order);
    return { orderId: order.id as string, status: 'CANCELED' };
  }
}

// export name as-is
export default CancelOrderUseCase;

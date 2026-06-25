import { describe, it, expect, beforeEach } from 'vitest';
import { PlaceOrderUseCase, ProductRepository, OrderRepository, OrderItem, Product, Order } from '../place-order.use-case';

class FakeProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  add(product: Product) {
    this.products.set(product.id, product);
  }

  findByName(name: string): Product | null {
    for (const p of this.products.values()) {
      if (p.name === name) return p;
    }
    return null;
  }

  decreaseStock(id: string, qty: number) {
    const p = this.products.get(id);
    if (!p) throw new Error('product not found');
    if (p.stock < qty) throw new Error('out of stock');
    p.stock -= qty;
  }
}

class FakeOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  save(order: Order) {
    order.id = `order-${this.orders.length + 1}`;
    this.orders.push(order);
    return order;
  }
}

describe('PlaceOrderUseCase', () => {
  let fakeProductRepository: FakeProductRepository;
  let fakeOrderRepository: FakeOrderRepository;
  let useCase: PlaceOrderUseCase;

  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeOrderRepository = new FakeOrderRepository();
    // use the real production class
    useCase = new PlaceOrderUseCase(fakeOrderRepository, fakeProductRepository);
  });

  it('given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned', async () => {
    // Given
    fakeProductRepository.add({ id: 'p-mojito', name: 'Mojito', stock: 10, price: 5 });

    // When
    const result = await useCase.execute({
      customerId: 'cust-1',
      items: [{ productName: 'Mojito', quantity: 1 }],
    });

    // Then
    expect(result).toBeDefined();
    expect((result).orderId).toBeTruthy();
    expect((result).status).toBe('EN_ATTENTE');
  });
});

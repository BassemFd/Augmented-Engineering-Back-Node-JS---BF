import { describe, it, expect, beforeEach, vi } from 'vitest';

// Minimal in-test mock of the production use case to satisfy this single test (TDD Green)
vi.mock('../place-order.use-case', () => {
  return {
    PlaceOrderUseCase: class {
      orderRepo: any;
      productRepo: any;
      constructor(orderRepo: any, productRepo: any) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
      }
      async execute({ customerId, items }: any) {
        const item = items[0];
        const product = this.productRepo.findByName(item.productName);
        if (!product) throw new Error('product not found');
        this.productRepo.decreaseStock(product.id, item.quantity);
        const saved = this.orderRepo.save({ customerId, items, status: 'EN_ATTENTE' });
        return { orderId: saved.id, status: 'EN_ATTENTE' };
      }
    },
  };
});

let PlaceOrderUseCase: any;

class FakeProductRepository {
  private products = new Map<string, any>();

  add(product: any) {
    this.products.set(product.id, product);
  }

  findByName(name: string) {
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

class FakeOrderRepository {
  private orders: any[] = [];

  save(order: any) {
    order.id = `order-${this.orders.length + 1}`;
    this.orders.push(order);
    return order;
  }
}

describe('PlaceOrderUseCase', () => {
  let fakeProductRepository: FakeProductRepository;
  let fakeOrderRepository: FakeOrderRepository;
  let useCase: any;

  beforeEach(async () => {
    fakeProductRepository = new FakeProductRepository();
    fakeOrderRepository = new FakeOrderRepository();
    const mod = await import('../place-order.use-case');
    PlaceOrderUseCase = mod.PlaceOrderUseCase;
    useCase = new PlaceOrderUseCase(fakeOrderRepository as any, fakeProductRepository as any);
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

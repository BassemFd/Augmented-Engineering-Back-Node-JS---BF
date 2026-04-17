import { describe, it, expect } from 'vitest';
import {
  PlaceOrderUseCase,
  type Order,
  type OrderRepository,
  type Product,
  type ProductRepository,
  ArticleInconnuException,
  StockInsuffisantException,
} from '../place-order.use-case.ts';

class FakeOrderRepository implements OrderRepository {
  private readonly orders: Order[] = [];

  save(order: Order): Order {
    const savedOrder = {
      ...order,
      id: `order-${this.orders.length + 1}`,
    };

    this.orders.push(savedOrder);
    return savedOrder;
  }
}

class FakeProductRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  constructor() {}

  add(product: Product): void {
    this.products.set(product.id, { ...product });
  }

  findByName(name: string): Product | null {
    for (const product of this.products.values()) {
      if (product.name === name) {
        return product;
      }
    }
    return null;
  }

  decreaseStock(id: string, qty: number): void {
    const product = this.products.get(id);
    if (!product) {
      throw new Error('ARTICLE_INCONNU');
    }

    if (product.stock < qty) {
      throw new Error('STOCK_INSUFFISANT');
    }

    product.stock -= qty;
  }
}

class StockAvailabilityFixture {
  readonly orderRepository: FakeOrderRepository;
  readonly productRepository: FakeProductRepository;
  readonly useCase: PlaceOrderUseCase;

  constructor() {
    this.orderRepository = new FakeOrderRepository();
    this.productRepository = new FakeProductRepository();
    this.useCase = new PlaceOrderUseCase(this.orderRepository, this.productRepository);
  }
}

describe('PlaceOrderUseCase - stock availability', () => {
  it('Commande confirmée quand le stock est suffisant (stock must decrement by 2)', async () => {
    // Given
    const fixture = new StockAvailabilityFixture();
    fixture.productRepository.add({
      id: 'p-mojito',
      name: 'Mojito',
      stock: 10,
      price: 5,
    });

    // When
    const result = await fixture.useCase.execute({
      customerId: 'c1',
      items: [{ productName: 'Mojito', quantity: 2 }],
    });

    // Then
    expect(result).toBeDefined();
    expect(result.status).toBe('EN_ATTENTE');
    const product = fixture.productRepository.findByName('Mojito');
    expect(product).not.toBeNull();
    expect(product?.stock).toBe(8);
  });

  it('Commande refusée quand le stock est insuffisant (STOCK_INSUFFISANT)', async () => {
    // Given
    const fixture = new StockAvailabilityFixture();
    fixture.productRepository.add({
      id: 'p-mojito',
      name: 'Mojito',
      stock: 1,
      price: 5,
    });

    // When / Then
    await expect(
      fixture.useCase.execute({
        customerId: 'c2',
        items: [{ productName: 'Mojito', quantity: 2 }],
      }),
    ).rejects.toBeInstanceOf(StockInsuffisantException);
  });

  it("Commande refusée si l'article n'existe pas (ARTICLE_INCONNU)", async () => {
    // Given
    const fixture = new StockAvailabilityFixture();

    // When / Then
    await expect(
      fixture.useCase.execute({
        customerId: 'c3',
        items: [{ productName: 'Champagne', quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ArticleInconnuException);
  });
});

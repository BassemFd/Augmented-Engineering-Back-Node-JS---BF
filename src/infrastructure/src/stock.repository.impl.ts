import type {
  Product,
  ProductRepository,
} from '@belairs-buvette/domain/src/use-cases/place-order.use-case.ts';

export class InMemoryStockRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  public constructor(initialProducts: Product[] = []) {
    for (const product of initialProducts) {
      this.add(product);
    }
  }

  public add(product: Product): void {
    this.products.set(product.id, { ...product });
  }

  public findByName(name: string): Product | null {
    for (const product of this.products.values()) {
      if (product.name === name) {
        return product;
      }
    }

    return null;
  }

  public decreaseStock(id: string, qty: number): void {
    const product = this.products.get(id);

    if (!product) {
      throw new Error('ARTICLE_INCONNU');
    }

    if (product.stock < qty) {
      throw new Error('STOCK_INSUFFISANT');
    }

    product.stock -= qty;
    this.products.set(id, product);
  }
}

export type OrderItem = { productName: string; quantity: number };
export type Order = { customerId: string; items: OrderItem[]; status: string; id?: string };
export type Product = { id: string; name: string; stock: number; price: number };

export interface ProductRepository {
  findByName(name: string): Promise<Product | null> | Product | null;
  decreaseStock(id: string, qty: number): void;
}

export interface OrderRepository {
  save(order: Order): Order;
}

export class PlaceOrderUseCase {
  private orderRepo: OrderRepository;
  private productRepo: ProductRepository;

  constructor(orderRepo: OrderRepository, productRepo: ProductRepository) {
    this.orderRepo = orderRepo;
    this.productRepo = productRepo;
  }

  async execute({ customerId, items }: { customerId: string; items: OrderItem[] }): Promise<{ orderId: string; status: string }> {
    const item = items[0];
    const product = await this.productRepo.findByName(item.productName);
    if (!product) throw new Error('product not found');
    this.productRepo.decreaseStock(product.id, item.quantity);
    const saved = this.orderRepo.save({ customerId, items, status: 'EN_ATTENTE' });
    return { orderId: saved.id as string, status: 'EN_ATTENTE' };
  }
}

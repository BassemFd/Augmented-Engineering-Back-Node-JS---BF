// Value objects (French names)
export type LigneCommande = { productName: string; quantity: number };
export type Commande = { customerId: string; items: LigneCommande[]; status: string; id?: string };
export type Article = { id: string; name: string; stock: number; price: number };

// Domain repository interfaces (remain in domain package)
export interface IStockRepository {
  findByName(name: string): Promise<Article | null> | Article | null;
  decreaseStock(id: string, qty: number): void;
}

export interface IOrderRepository {
  save(order: Commande): Commande;
}

// Backwards-compatible aliases (existing tests/files expect these names)
export type OrderItem = LigneCommande;
export type Order = Commande;
export type Product = Article;
export type ProductRepository = IStockRepository;
export type OrderRepository = IOrderRepository;

// Domain exceptions (typed)
export class ArticleInconnuException extends Error {
  constructor() {
    super('ARTICLE_INCONNU');
    this.name = 'ArticleInconnuException';
  }
}

export class StockInsuffisantException extends Error {
  constructor() {
    super('STOCK_INSUFFISANT');
    this.name = 'StockInsuffisantException';
  }
}

// Use case in French: PasserCommandeUseCase
export class PasserCommandeUseCase {
  private orderRepo: IOrderRepository;
  private stockRepo: IStockRepository;

  constructor(orderRepo: IOrderRepository, stockRepo: IStockRepository) {
    this.orderRepo = orderRepo;
    this.stockRepo = stockRepo;
  }

  async execute({ customerId, items }: { customerId: string; items: LigneCommande[] }): Promise<{ orderId: string; status: string }> {
    const item = items[0];
    const article = await this.stockRepo.findByName(item.productName);

    if (!article) {
      throw new ArticleInconnuException();
    }

    if (article.stock < item.quantity) {
      throw new StockInsuffisantException();
    }

    this.stockRepo.decreaseStock(article.id, item.quantity);

    const saved = this.orderRepo.save({ customerId, items, status: 'EN_ATTENTE' });
    return { orderId: saved.id as string, status: 'EN_ATTENTE' };
  }
}

// Export legacy name as alias for compatibility with existing tests and code
export { PasserCommandeUseCase as PlaceOrderUseCase };
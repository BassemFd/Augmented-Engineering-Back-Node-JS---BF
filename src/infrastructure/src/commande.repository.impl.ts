// In-memory repository implementation placed in infrastructure for Refactor step.
// It keeps persistence types local to infrastructure and maps them to domain-like
// shapes to preserve clean boundaries.

import type {
  Order,
  OrderRepository,
} from '@belairs-buvette/domain/src/use-cases/place-order.use-case.ts';

type InfraLine = { article: string; quantite: number };
type InfraOrder = {
  id?: string;
  festivalierId: string;
  lignes: InfraLine[];
  statut: string;
};

function mapDomainToInfra(order: Order): InfraOrder {
  return {
    id: order.id,
    festivalierId: order.customerId,
    lignes: order.items.map((item) => ({
      article: item.productName,
      quantite: item.quantity,
    })),
    statut: order.status,
  };
}

function mapInfraToDomain(order: InfraOrder): Order {
  return {
    id: order.id,
    customerId: order.festivalierId,
    items: order.lignes.map((line) => ({
      productName: line.article,
      quantity: line.quantite,
    })),
    status: order.statut,
  };
}

export class InMemoryCommandeRepository implements OrderRepository {
  private store = new Map<string, InfraOrder>();
  private seq = 0;

  save(order: Order): Order {
    this.seq += 1;
    const id = order.id ?? `cmd-${this.seq}`;
    const savedInfra = { ...mapDomainToInfra(order), id };
    this.store.set(id, savedInfra);
    return mapInfraToDomain(savedInfra);
  }

  findById(id: string): Order | null {
    const found = this.store.get(id);
    return found ? mapInfraToDomain(found) : null;
  }

  updateStatus(id: string, status: string): void {
    const existing = this.store.get(id);
    if (!existing) throw new Error('NOT_FOUND');
    existing.statut = status;
    this.store.set(id, existing);
  }

  findByCustomerAndStatus(customerId: string, status: string): Order[] {
    const results: Order[] = [];
    for (const order of this.store.values()) {
      if (order.festivalierId === customerId && order.statut === status) {
        results.push(mapInfraToDomain(order));
      }
    }
    return results;
  }
}

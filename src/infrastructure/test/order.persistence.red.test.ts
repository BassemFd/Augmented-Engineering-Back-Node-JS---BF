import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCommandeRepository } from '../src/commande.repository.impl.ts';

describe('Order persistence - Green (infrastructure, in-test fake)', () => {
  let repo: InMemoryCommandeRepository;

  beforeEach(() => {
    repo = new InMemoryCommandeRepository();
  });

  it('Sauvegarder une nouvelle commande', async () => {
    const order = {
      customerId: 'festivalier-1',
      status: 'EN_ATTENTE',
      items: [
        { productName: 'Mojito', quantity: 2 },
        { productName: 'Eau plate', quantity: 1 },
      ],
    };

    const saved = repo.save(order);
    expect(saved.id).toBeDefined();

    const found = repo.findById(saved.id as string);
    expect(found).not.toBeNull();
    expect(found?.status).toBe('EN_ATTENTE');
    expect(found?.items).toHaveLength(2);
    expect(found?.items[0].productName).toBe('Mojito');
  });

  it("Mettre à jour le statut d'une commande", async () => {
    const saved = repo.save({ customerId: 'f1', status: 'EN_ATTENTE', items: [] });
    repo.updateStatus(saved.id as string, 'PRÊTE');

    const found = repo.findById(saved.id as string);
    expect(found).not.toBeNull();
    expect(found?.status).toBe('PRÊTE');
  });

  it("Retrouver les commandes en attente d'un festivalier", async () => {
    repo.save({ customerId: 'festivalier-42', status: 'EN_ATTENTE', items: [] });
    repo.save({ customerId: 'festivalier-42', status: 'EN_ATTENTE', items: [] });
    repo.save({ customerId: 'festivalier-42', status: 'PRÊTE', items: [] });

    const pending = repo.findByCustomerAndStatus('festivalier-42', 'EN_ATTENTE');
    expect(pending).toHaveLength(2);
  });
});

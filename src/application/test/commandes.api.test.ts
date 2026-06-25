import { describe, expect, it } from 'vitest';
import { createApplicationRouter } from '../src/http/router.ts';
import type { HttpRequest } from '../src/http/http-types.ts';
import {
  CreerCommandeDepuisDomaineUseCase,
} from '../src/commandes/commande.controller.ts';
import { PasserCommandeUseCase } from '@belairs-buvette/domain/src/use-cases/place-order.use-case.ts';
import {
  InMemoryCommandeRepository,
  InMemoryStockRepository,
} from '@belairs-buvette/infrastructure/src/index.ts';

class StubPasserCommandeUseCase {
  async execute(input: {
    customerId: string;
    items: Array<{ productName: string; quantity: number }>;
  }): Promise<{ orderId: string; status: string }> {
    if (input.customerId.trim().length === 0) {
      throw new Error('CUSTOMER_ID_INVALIDE');
    }

    return {
      orderId: 'cmd-1',
      status: 'EN_ATTENTE',
    };
  }
}

describe('POST /commandes', () => {
  it('returns 201 and the created command id with status EN_ATTENTE (API -> Domain -> Infrastructure)', async () => {
    const orderRepository = new InMemoryCommandeRepository();
    const stockRepository = new InMemoryStockRepository([
      {
        id: 'stock-1',
        name: 'drink-mojito',
        stock: 10,
        price: 12,
      },
    ]);
    const passerCommandeUseCase = new PasserCommandeUseCase(
      orderRepository,
      stockRepository,
    );
    const useCase = new CreerCommandeDepuisDomaineUseCase(passerCommandeUseCase);
    const router = createApplicationRouter({ creerCommandeUseCase: useCase });

    const request: HttpRequest = {
      method: 'POST',
      path: '/commandes',
      body: {
        festivalierId: 'fest-1',
        articles: [{ articleId: 'drink-mojito', quantite: 1 }],
      },
    };

    const response = await router.handle(request);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      commandeId: 'cmd-1',
      statut: 'EN_ATTENTE',
    });

    const stored = orderRepository.findById('cmd-1');
    expect(stored).not.toBeNull();
    expect(stored?.customerId).toBe('fest-1');
    expect(stored?.status).toBe('EN_ATTENTE');
  });

  it('returns 400 when payload is invalid', async () => {
    const useCase = new CreerCommandeDepuisDomaineUseCase(
      new StubPasserCommandeUseCase(),
    );
    const router = createApplicationRouter({ creerCommandeUseCase: useCase });

    const request: HttpRequest = {
      method: 'POST',
      path: '/commandes',
      body: {
        festivalierId: '',
        articles: [],
      },
    };

    const response = await router.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request payload',
    });
  });

  it('returns 404 when route does not exist', async () => {
    const useCase = new CreerCommandeDepuisDomaineUseCase(
      new StubPasserCommandeUseCase(),
    );
    const router = createApplicationRouter({ creerCommandeUseCase: useCase });

    const request: HttpRequest = {
      method: 'GET',
      path: '/commandes',
      body: {},
    };

    const response = await router.handle(request);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
    });
  });

  it('requête refusée si le festivalier n\'est pas authentifié', async () => {
    const useCase = new CreerCommandeDepuisDomaineUseCase(
      new StubPasserCommandeUseCase(),
    );
    const router = createApplicationRouter({
      creerCommandeUseCase: useCase,
      authenticate: (request: HttpRequest) => {
        const body = request.body as { festivalierId?: unknown } | undefined;
        return !(body && body.festivalierId === 'festivalier-42');
      },
    });

    const request: HttpRequest = {
      method: 'POST',
      path: '/commandes',
      // Simulate an unauthenticated request by omitting any auth context
      body: {
        festivalierId: 'festivalier-42',
        articles: [{ articleId: 'mojito', quantite: 2 }],
      },
    };

    const response = await router.handle(request);

    // RED: we expect 401 for unauthenticated requests — this should fail until auth is implemented
    expect(response.statusCode).toBe(401);
  });
});

import { describe, expect, it } from 'vitest';
import { createApplicationRouter } from '../src/http/router.ts';
import type { HttpRequest } from '../src/http/http-types.ts';
import type { CreerCommandeUseCase } from '../src/commandes/commande.controller.ts';

class FakeCreerCommandeUseCase implements CreerCommandeUseCase {
  public receivedInput:
    | {
        festivalierId: string;
        articles: Array<{ articleId: string; quantite: number }>;
      }
    | undefined;

  async execute(input: {
    festivalierId: string;
    articles: Array<{ articleId: string; quantite: number }>;
  }): Promise<{ commandeId: string; statut: string }> {
    this.receivedInput = input;
    return {
      commandeId: 'cmd-123',
      statut: 'EN_ATTENTE',
    };
  }
}

describe('POST /commandes', () => {
  
  it('returns 201 and the created command id with status EN_ATTENTE', async () => {
    const useCase = new FakeCreerCommandeUseCase();
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
      commandeId: 'cmd-123',
      statut: 'EN_ATTENTE',
    });
    expect(useCase.receivedInput).toEqual({
      festivalierId: 'fest-1',
      articles: [{ articleId: 'drink-mojito', quantite: 1 }],
    });
  });

  it('returns 400 when payload is invalid', async () => {
    const useCase = new FakeCreerCommandeUseCase();
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
    expect(useCase.receivedInput).toBeUndefined();
  });

  it('returns 404 when route does not exist', async () => {
    const useCase = new FakeCreerCommandeUseCase();
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
    const useCase = new FakeCreerCommandeUseCase();
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

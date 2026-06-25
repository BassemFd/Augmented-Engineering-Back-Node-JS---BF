import type { HttpResponse } from '../http/http-types.ts';
import type {
  CreerCommandeRequest,
  CreerCommandeResponse,
} from './creer-commande.dto.ts';

type PasserCommandePort = {
  execute(input: {
    customerId: string;
    items: Array<{ productName: string; quantity: number }>;
  }): Promise<{ orderId: string; status: string }>;
};

export interface CreerCommandeUseCase {
  execute(input: {
    festivalierId: string;
    articles: Array<{ articleId: string; quantite: number }>;
  }): Promise<CreerCommandeResponse>;
}

export class CreerCommandeDepuisDomaineUseCase implements CreerCommandeUseCase {
  public constructor(private readonly passerCommandeUseCase: PasserCommandePort) {}

  public async execute(input: {
    festivalierId: string;
    articles: Array<{ articleId: string; quantite: number }>;
  }): Promise<CreerCommandeResponse> {
    const result = await this.passerCommandeUseCase.execute({
      customerId: input.festivalierId,
      items: input.articles.map((article) => ({
        productName: article.articleId,
        quantity: article.quantite,
      })),
    });

    return {
      commandeId: result.orderId,
      statut: result.status,
    };
  }
}

export class CommandesController {
  public constructor(private readonly creerCommandeUseCase: CreerCommandeUseCase) {}

  public async postCommandes(payload: unknown): Promise<HttpResponse> {
    if (!this.isValidPayload(payload)) {
      return {
        statusCode: 400,
        body: { error: 'Invalid request payload' },
      };
    }

    const result = await this.creerCommandeUseCase.execute({
      festivalierId: payload.festivalierId,
      articles: payload.articles,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }

  private isValidPayload(payload: unknown): payload is CreerCommandeRequest {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const candidate = payload as {
      festivalierId?: unknown;
      articles?: unknown;
    };

    if (
      typeof candidate.festivalierId !== 'string' ||
      candidate.festivalierId.trim().length === 0
    ) {
      return false;
    }

    if (!Array.isArray(candidate.articles) || candidate.articles.length === 0) {
      return false;
    }

    return candidate.articles.every((article) => {
      if (!article || typeof article !== 'object') {
        return false;
      }

      const typedArticle = article as {
        articleId?: unknown;
        quantite?: unknown;
      };

      return (
        typeof typedArticle.articleId === 'string' &&
        typedArticle.articleId.trim().length > 0 &&
        typeof typedArticle.quantite === 'number' &&
        Number.isInteger(typedArticle.quantite) &&
        typedArticle.quantite > 0
      );
    });
  }
}

import {
  CommandesController,
  type CreerCommandeUseCase,
} from '../commandes/commande.controller.ts';
import type { HttpRequest, HttpResponse } from './http-types.ts';

export type ApplicationRouter = {
  handle(request: HttpRequest): Promise<HttpResponse>;
};

export const createApplicationRouter = (deps: {
  creerCommandeUseCase: CreerCommandeUseCase;
}): ApplicationRouter => {
  const commandesController = new CommandesController(deps.creerCommandeUseCase);

  return {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      if (request.method === 'POST' && request.path === '/commandes') {
        return commandesController.postCommandes(request.body);
      }

      return {
        statusCode: 404,
        body: { error: 'Not Found' },
      };
    },
  };
};

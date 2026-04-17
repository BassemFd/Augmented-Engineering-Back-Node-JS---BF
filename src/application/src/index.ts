// Entry point — wire your domain and infrastructure layers here
import { createApplicationRouter } from './http/router.ts';
import type { HttpRequest, HttpResponse } from './http/http-types.ts';
import { CreerCommandeDepuisDomaineUseCase } from './commandes/commande.controller.ts';
import { PasserCommandeUseCase } from '@belairs-buvette/domain/src/use-cases/place-order.use-case.ts';
import {
	InMemoryCommandeRepository,
	InMemoryStockRepository,
} from '@belairs-buvette/infrastructure/src/index.ts';

/**
 * Builds the Belair's Buvette backend welcome message.
 */
export const buildWelcomeMessage = (
	appName = "Belair's Buvette backend",
): string => `Hello from ${appName}!`;

/**
 * Application-layer bootstrap hook.
 * Keeps I/O explicit and testable.
 */
export const runApplication = (
	log: (message: string) => void = console.log,
): void => {
	log(buildWelcomeMessage());
};

export type Application = {
	handle(request: HttpRequest): Promise<HttpResponse>;
};

export const buildApplication = (deps: {
	creerCommandeUseCase: {
		execute(input: {
			festivalierId: string;
			articles: Array<{ articleId: string; quantite: number }>;
		}): Promise<{ commandeId: string; statut: string }>;
	};
}): Application => createApplicationRouter(deps);

export const buildApplicationWithInMemoryDependencies = (): Application => {
	const orderRepository = new InMemoryCommandeRepository();
	const stockRepository = new InMemoryStockRepository([
		{
			id: 'stock-1',
			name: 'drink-mojito',
			stock: 25,
			price: 12,
		},
	]);
	const passerCommandeUseCase = new PasserCommandeUseCase(
		orderRepository,
		stockRepository,
	);
	const creerCommandeUseCase = new CreerCommandeDepuisDomaineUseCase(
		passerCommandeUseCase,
	);

	return buildApplication({ creerCommandeUseCase });
};

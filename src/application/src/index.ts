// Entry point — wire your domain and infrastructure layers here

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

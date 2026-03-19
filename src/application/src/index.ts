// Entry point — wire your domain and infrastructure layers here

/**
 * Logs the Belair's Buvette backend welcome message.
 */
export const logWelcomeMessage = (): void => {
	console.log("Hello from Belair's Buvette backend!");
};

/**
 * Returns the sum of two numbers.
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 */
export function sum(a: number, b: number): number {
	return a + b;
}
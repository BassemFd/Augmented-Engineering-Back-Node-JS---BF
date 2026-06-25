# TypeScript Backend Coding Guidelines

This document defines the TypeScript coding conventions and best practices for the project (NestJS). Follow these rules to keep the codebase consistent, readable, and maintainable.

## Formatting

- **Indentation:** 2 spaces per indent level.
- **Line length:** Prefer max 120 characters.
- Use **Prettier** for formatting, **ESLint** for linting (configured in `.prettierrc` and `.eslintrc.json`).

## Naming Conventions

- **Files/Directories:** kebab-case: `order-repository.ts`, `create-order.use-case.ts`.
- **Classes:** PascalCase: `OrderService`, `CreateOrderUseCase`.
- **Interfaces:** PascalCase: `OrderRepository`, `ContactPort`.
- **Methods:** camelCase, verb-based: `createOrder()`.
- **Variables / Parameters:** camelCase: `orderItems`, `totalAmount`.
- **Constants:** UPPER_SNAKE_CASE for module-level: `DEFAULT_TAX_RATE`.

## TypeScript Features

Use strict mode: `"strict": true` in `tsconfig.json`.

```typescript
export class Money {
  constructor(
    readonly amount: number,
    readonly currency: string,
  ) {
    if (amount < 0) throw new Error('amount must not be negative');
  }
}
```

## Dependency Injection (NestJS)

```typescript
@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}
}
```

## Error Handling

- Use domain-specific exception classes extending built-in `Error`.
- Use NestJS exception filters for HTTP error mapping.
- Never swallow exceptions silently.

## Async/Await

- Use `async/await` for all asynchronous operations.
- Propagate errors via `try/catch` or let them bubble to global exception filters.

## Build & Dependencies

- Use pnpm for package management.
- Keep scripts in `package.json`, dependency versions pinned in `pnpm-lock.yaml`.

## References & Further Reading

- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [NestJS Documentation](https://docs.nestjs.com/)
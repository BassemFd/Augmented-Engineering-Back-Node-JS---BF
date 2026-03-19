# Testing Guidelines

## Domain Layer Testing Guidelines

### High-level Principles

- Tests drive the system through use-case handler functions.
- No mocking frameworks: provide lightweight in-process fakes for secondary ports.
- Fakes implement a `TestState<T>` interface for seeding and querying state.
- Tests follow Given-When-Then (BDD) structure with Vitest.

### Fake repository example

```typescript
class FakeOrderRepository implements OrderRepository {
  private store: Order[] = [];

  add(item: Order): void {
    this.store = this.store.filter(o => o.id !== item.id);
    this.store.push(item);
  }

  findById(id: string): Order | undefined {
    return this.store.find(o => o.id === id);
  }

  findAll(): Order[] { return [...this.store]; }
}
```

### Test structure (Given-When-Then)

```typescript
describe('ExportContactUseCase', () => {
  it('should produce export DTO when contacts exist', async () => {
    // Given
    const fixture = new ContactExportFixture();
    Array.from({ length: 20 }, (_, i) =>
      fixture.contactState.add(new Contact(`Contact ${i}`, `c${i}@example.com`))
    );

    // When
    const result = await fixture.useCase.execute(new ExportContactQuery('user-1'));

    // Then
    expect(result).toBeDefined();
    expect(result.contacts).toHaveLength(20);
  });
});
```

## API Testing Guidelines (Application Layer)

- Use Vitest + Supertest for HTTP integration tests with a NestJS test module.
- Seed state via fakes injected through the dependency injection container.

```typescript
it('POST /orders returns 201', async () => {
  const response = await request(app.getHttpServer())
    .post('/orders')
    .send({ items: [{ id: 'item-1', qty: 2 }] })
    .expect(201);
  expect(response.body.status).toBe('Pending');
});
```

## Infrastructure Testing Guidelines

- Use Testcontainers (`testcontainers-node`) with a real PostgreSQL container.
- Validate migrations against a clean database started by Testcontainers.
---
agent: agent
name: TDD Red step
description: Ce prompt ecrit exactement un test qui echoue pour une etape Red TDD, sans implementer de code de production, et prepare un handoff JSON vers Green.
argument-hint: Ecris ce test Red en TDD: scenario_description={scenario_description} ou issue_reference={issue_reference}
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/problems', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search', 'context7/*', 'todo']
model: GPT-5 mini (copilot)
---

# Red TDD step prompt

## Principes directeurs
- TDD as if you meant it: l'etape Red sert a produire un test qui echoue clairement, pas a corriger le systeme.
- La sortie structuree est obligatoire pour transmettre des informations fiables a l'etape Green.
- Les exemples negatifs sont prioritaires pour eviter les derives de comportement.

## Objectif
Ecrire exactement un test correspondant au scenario demandé, verifier qu'il échoue, et retourner un JSON structure prêt pour l'étape Green.

## Input attendu
- `scenario_description`: scenario texte direct (option 1)
- `issue_reference`: reference issue contenant le scenario (option 2)

Au moins un des deux champs doit etre fourni.

Exemple d'input:
- `scenario_description`: Given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned

## Instructions
1. Analyser le scenario fourni.
   - Si `issue_reference` est fourni, recuperer le contenu de l'issue et extraire le scenario cible.
   - Si `scenario_description` est fourni, l'utiliser tel quel.
2. Identifier la bonne couche de test (domain/application/infrastructure) selon le scenario.
3. Determiner le fichier de test cible:
   - Si le fichier existe deja pour ce use case, ajouter un seul nouveau test.
   - Sinon, creer le fichier dans le bon repertoire:
     - Domain use-case tests: `src/domain/use-cases/__tests__/`
     - Application tests: `test/application/`
     - Infrastructure tests: `test/infrastructure/`
4. Ecrire un test Vitest qui traduit fidelement le scenario et doit echouer au premier run.
5. Executer le test pour verifier l'echec:
   - `pnpm vitest run <test_file_path> -t "<test_name>"`
6. Si le test passe deja, ajuster uniquement le test pour qu'il exprime mieux l'attendu metier et echoue explicitement.

## Regles strictes
- **NE PAS** implementer de code de production.
- **NE PAS** modifier le code de production existant.
- **NE PAS** corriger un autre test que le test cible.
- **NE PAS** ajouter de fonctionnalite non demandee par le scenario.
- Utiliser Vitest avec `describe`/`it`/`expect`.
- Pour le domaine, privilegier le pattern FakeRepository (sans framework de mock).
- Garder des types TypeScript corrects, sans `any`.

## Exemples negatifs (interdits)
- Interdit: modifier `src/domain/use-cases/place-order.use-case.ts` pendant Red.
- Interdit: ajouter une logique metier dans un stub pour faire passer le test.
- Interdit: ecrire plusieurs nouveaux tests alors qu'un seul scenario est demande.
- Interdit: renvoyer un compte rendu en texte libre au lieu du JSON obligatoire.

## Exemples

### Exemple 1

Input:
```json
{
  "scenario_description": "Given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
}
```

Expected output (JSON):
```json
{
  "status": "passed",
  "scenario": "Given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned",
  "test": {
    "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
    "name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
  },
  "changes": [
    {
      "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
      "summary": "Added one failing test for place-order scenario with typed fakes"
    }
  ],
  "constraints": {
    "production_code_created": false,
    "production_code_modified": false,
    "other_tests_modified": false,
    "extra_tests_added": false
  },
  "verification": {
    "command": "pnpm vitest run src/domain/use-cases/__tests__/place-order.use-case.test.ts -t \"given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned\"",
    "result": "fail",
    "failing_reason": "Not implemented"
  },
  "handoff": {
    "ready_for_green": true,
    "test_file_path": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
    "test_name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
  }
}
```

### Exemple 2
Input:
```json
{
  "scenario_description": "Given a valid payload, when POST /orders is called, then it returns 201"
}
```

Expected output (JSON):
```json
{
  "status": "passed",
  "scenario": "Given a valid payload, when POST /orders is called, then it returns 201",
  "test": {
    "file": "src/application/test/place-order.controller.test.ts",
    "name": "given a valid payload when POST /orders then returns 201"
  },
  "changes": [
    {
      "file": "src/application/test/place-order.controller.test.ts",
      "summary": "Added one failing test for POST /orders success scenario"
    }
  ],
  "constraints": {
    "production_code_created": false,
    "production_code_modified": false,
    "other_tests_modified": false,
    "extra_tests_added": false
  },
  "verification": {
    "command": "pnpm vitest run src/application/test/place-order.controller.test.ts -t \"given a valid payload when POST /orders then returns 201\"",
    "result": "fail",
    "failing_reason": "Expected status 201, received 500"
  },
  "handoff": {
    "ready_for_green": true,
    "test_file_path": "src/application/test/place-order.controller.test.ts",
    "test_name": "given a valid payload when POST /orders then returns 201"
  }
}
```

## Exemple de test domaine (contenu genere attendu)

Fichier attendu: `src/domain/use-cases/__tests__/place-order.use-case.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { PlaceOrderUseCase } from '../place-order.use-case';

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}

interface PlaceOrderInput {
  customerId: string;
  items: Array<{ productName: string; quantity: number }>;
}

class FakeProductRepository {
  private products = new Map<string, Product>();

  add(product: Product): void {
    this.products.set(product.id, product);
  }

  findByName(name: string): Product | null {
    for (const product of this.products.values()) {
      if (product.name === name) return product;
    }
    return null;
  }

  decreaseStock(id: string, qty: number): void {
    const product = this.products.get(id);
    if (!product) throw new Error('product not found');
    if (product.stock < qty) throw new Error('out of stock');
    product.stock -= qty;
  }
}

class FakeOrderRepository {
  private count = 0;

  save(order: Omit<{ id: string; customerId: string; status: string }, 'id'>): { id: string; customerId: string; status: string } {
    this.count += 1;
    return {
      id: `order-${this.count}`,
      customerId: order.customerId,
      status: order.status,
    };
  }
}

describe('PlaceOrderUseCase', () => {
  let fakeProductRepository: FakeProductRepository;
  let fakeOrderRepository: FakeOrderRepository;
  let useCase: PlaceOrderUseCase;

  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeOrderRepository = new FakeOrderRepository();
    useCase = new PlaceOrderUseCase(fakeOrderRepository, fakeProductRepository);
  });

  it('given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned', async () => {
    // Given
    fakeProductRepository.add({ id: 'p-mojito', name: 'Mojito', stock: 10, price: 5 });

    // When
    const result = await useCase.execute({
      customerId: 'cust-1',
      items: [{ productName: 'Mojito', quantity: 1 }],
    } as PlaceOrderInput);

    // Then
    expect(result).toBeDefined();
    // Red expectation: this should fail until Green step implements minimal behavior.
    expect(result).toMatchObject({
      orderId: expect.any(String),
      status: 'EN_ATTENTE',
    });
  });
});
```

## Notes
- Le test doit s'executer: l'echec doit venir d'une assertion ou d'un comportement non implemente, pas d'un import casse.
- Utiliser des stubs/fakes legers uniquement pour permettre l'execution du test.
- Si une implementation manquante bloque l'execution, un placeholder minimal qui lance `Not implemented` est autorise pour obtenir un echec propre.

## Format de sortie obligatoire
Repondre uniquement avec un JSON valide conforme a cette structure:

```json
{
  "status": "passed | failed",
  "scenario": "string",
  "test": {
    "file": "string",
    "name": "string"
  },
  "changes": [
    {
      "file": "string",
      "summary": "string"
    }
  ],
  "constraints": {
    "production_code_created": false,
    "production_code_modified": false,
    "other_tests_modified": false,
    "extra_tests_added": false
  },
  "verification": {
    "command": "string",
    "result": "fail | pass",
    "failing_reason": "string (optionnel)"
  },
  "handoff": {
    "ready_for_green": "boolean",
    "test_file_path": "string",
    "test_name": "string"
  }
}
```

## Critere d'acceptation Red
- Le test cible doit etre en echec (`verification.result: "fail"`).
- Si le test passe, la sortie doit etre `status: "failed"` tant que le comportement Red n'est pas valide.
- Si `production_code_created` ou `production_code_modified` est `true`, la sortie doit etre `status: "failed"`.
- Si le scenario n'est pas exploitable en un test clair, la sortie doit etre `status: "failed"` avec `failing_reason` explicite.
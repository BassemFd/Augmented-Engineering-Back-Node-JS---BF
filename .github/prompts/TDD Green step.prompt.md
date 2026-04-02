---
agent: agent
name: TDD Green step
description: Ce prompt implémente le minimum de code dans la classe de test pour faire passer un test rédigé à l'étape Red, sans modifier le test ni le code de production.
argument-hint: Fais passer ce test Red en TDD Green: test_file_path={test_file_path}, test_name={test_name}
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/problems', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search', 'context7/*', 'todo']
model: GPT-5 mini (copilot)
---

# Green TDD step prompt

## Principes directeurs
- TDD as if you meant it: à l'etape Green, l'agent doit rester focalise sur le test cible et ne jamais ouvrir la porte a une implementation de production.
- La sortie structuree est obligatoire pour enchaîner proprement vers l'etape Refactor.
- Les exemples negatifs sont prioritaires pour contraindre le comportement (quoi ne PAS faire).

## Objectif
Faire passer exactement **un** test provenant de l'étape Red en implémentant le minimum nécessaire, uniquement dans la classe de test, puis vérifier le résultat.

## Input attendu
- `test_file_path`: chemin du fichier de test rédigé à l'étape Red
- `test_name`: nom exact du test (`it(...)`) à faire passer

Exemple d'input:
- `test_file_path`: `src/domain/use-cases/__tests__/place-order.use-case.test.ts`
- `test_name`: `given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned`

## Instructions
1. Ouvrir le fichier indiqué par `test_file_path` et localiser le test `test_name`.
2. Comprendre précisément ce que ce test exige, sans élargir le comportement.
3. Implémenter le strict minimum de code pour passer ce test:
   - uniquement dans la classe de test (fakes, helpers, stubs locaux au fichier de test),
   - sans toucher au code de production,
   - sans modifier le contenu du test ciblé.
4. Exécuter uniquement le test ciblé pour valider le passage au vert:
   - `pnpm vitest run <test_file_path> -t "<test_name>"`
5. Si le test échoue encore, ajuster de manière minimale et réexécuter jusqu'à ce qu'il passe.

## Règles strictes
- **NE PAS** modifier le test cible (`test_name`) lui-même.
- **NE PAS** modifier d'autres tests dans la même classe de test.
- **NE PAS** ajouter de code/fonctionnalité non demandée par le test.
- **NE PAS** modifier le code de production (use case, services, adapters, etc.).
- Garder les types TypeScript corrects (pas de `any`).

## Exemples negatifs (interdits)
- Interdit: modifier `src/domain/use-cases/place-order.use-case.ts` pour faire passer le test.
- Interdit: changer l'assertion du test cible pour le rendre plus facile a faire passer.
- Interdit: corriger un autre test du meme fichier "au passage".
- Interdit: ajouter des comportements non verifies par `test_name`.
- Interdit: repondre en texte libre au lieu d'un JSON strictement conforme.

## Exemples

### Exemple 1
Input:
```json
{
  "test_file_path": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
  "test_name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
}
```

Expected output (JSON):
```json
{
  "status": "passed",
  "test": {
    "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
    "name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
  },
  "changes": [
    {
      "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
      "summary": "Typed Fake repositories and minimal in-test implementation to satisfy the scenario"
    }
  ],
  "constraints": {
    "production_code_modified": false,
    "target_test_modified": false,
    "other_tests_modified": false,
    "extra_features_added": false
  },
  "verification": {
    "command": "pnpm vitest run src/domain/use-cases/__tests__/place-order.use-case.test.ts -t \"given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned\"",
    "result": "pass"
  },
  "handoff": {
    "ready_for_refactor": true,
    "notes": "Green reached with minimal changes only in test scope"
  }
}
```

### Exemple 2
Input:
```json
{
  "test_file_path": "src/application/test/place-order.controller.test.ts",
  "test_name": "given a valid payload when POST /orders then returns 201"
}
```

Expected output (JSON):
```json
{
  "status": "failed",
  "test": {
    "file": "src/application/test/place-order.controller.test.ts",
    "name": "given a valid payload when POST /orders then returns 201"
  },
  "changes": [
    {
      "file": "src/application/test/place-order.controller.test.ts",
      "summary": "Minimal local test stub added, but assertion still failing"
    }
  ],
  "constraints": {
    "production_code_modified": false,
    "target_test_modified": false,
    "other_tests_modified": false,
    "extra_features_added": false
  },
  "verification": {
    "command": "pnpm vitest run src/application/test/place-order.controller.test.ts -t \"given a valid payload when POST /orders then returns 201\"",
    "result": "fail",
    "failing_reason": "Expected status 201, received 500"
  },
  "handoff": {
    "ready_for_refactor": false,
    "notes": "Green not reached; keep iterating minimally in test scope"
  }
}
```

## Format de sortie obligatoire
Répondre **uniquement** avec un JSON valide conforme à cette structure:

```json
{
  "status": "passed | failed",
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
    "production_code_modified": false,
    "target_test_modified": false,
    "other_tests_modified": false,
    "extra_features_added": false
  },
  "verification": {
    "command": "string",
    "result": "pass | fail",
    "failing_reason": "string (optionnel)"
  },
  "handoff": {
    "ready_for_refactor": "boolean",
    "notes": "string"
  }
}
```

## Critere d'acceptation Green
- Si `production_code_modified` est `true`, la sortie doit etre `status: "failed"`.
- Si `target_test_modified` est `true`, la sortie doit etre `status: "failed"`.
- Si `other_tests_modified` est `true`, la sortie doit etre `status: "failed"`.
- Si la verification ne passe pas, la sortie doit etre `status: "failed"` et inclure `verification.failing_reason`.

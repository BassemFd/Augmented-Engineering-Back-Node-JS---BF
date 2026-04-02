---
agent: agent
name: TDD Refactor step
description: Ce prompt déplace le code de production hors de la classe de test après Green, nettoie le code sans changer le comportement, et maintient les tests au vert en micro-étapes.
argument-hint: Refactor TDD à partir du JSON Green : green_output={green_output}
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/problems', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search', 'context7/*', 'todo']
model: GPT-5 mini (copilot)
---

# Refactor TDD step prompt

## Principes directeurs
- TDD as if you meant it: le comportement est déjà validé en Green; le Refactor ne doit pas changer ce comportement.
- Le Refactor se fait par micro-étapes strictes: modifier une chose, lancer le test cible, valider, puis continuer.
- La sortie structurée est obligatoire pour tracer les modifications et vérifier les garde-fous.
-Les micro-étapes validées (modifier → tester → valider → continuer) sont le meilleur rempart contre la dérive
- Les exemples négatifs sont prioritaires pour contraindre le comportement (quoi ne PAS faire).

## Objectif
À partir de la sortie JSON de l'étape Green, déplacer le code de production provisoire hors de la classe de test vers les classes de production appropriées, nettoyer le code, et garder les tests au vert à chaque micro-étape.

## Input attendu
- `green_output`: JSON complet retourné par le prompt `TDD Green step`

Le JSON Green doit inclure au minimum:
- `test.file`
- `test.name`
- `constraints.production_code_modified`
- `verification.result`

Exemple d'input :
```json
{
  "green_output": {
    "status": "passed",
    "test": {
      "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
      "name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
    },
    "changes": [
      {
        "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
        "summary": "Minimal in-test implementation added to pass target test"
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
      "notes": "Green reached"
    }
  }
}
```

## Instructions
1. Valider l'entrée :
  - Vérifier que `green_output.status` est `passed`.
  - Vérifier que `green_output.handoff.ready_for_refactor` est `true`.
   - Si ce n'est pas le cas, retourner `status: "failed"` avec `failing_reason`.
2. Ouvrir `green_output.test.file` et identifier le code de production temporaire placé dans la classe de test.
3. Planifier des micro-étapes de refactor minimales :
   - extraire une partie de logique vers la classe de production cible,
   - adapter le test pour consommer la vraie classe de production,
   - supprimer uniquement le code temporaire devenu inutile.
4. Appliquer une seule micro-modification à la fois, puis lancer immédiatement :
   - `pnpm vitest run <test_file_path> -t "<test_name>"`
5. Si un test échoue :
   - corriger minimalement,
  - relancer le même test,
  - ne passer à l'étape suivante que lorsque le test redevient vert.
6. À la fin, exécuter les tests nécessaires pour vérifier qu'il n'y a pas de régression locale (au minimum le test cible ; idéalement le fichier de test entier).
7. Retourner un JSON strict de synthèse.

## Règles strictes
- **NE PAS** modifier le comportement fonctionnel valide par le test cible.
- **NE PAS** modifier le nom, le texte, ni l'intention métier du test cible.
- **NE PAS** introduire de nouvelles fonctionnalités non couvertes par le scénario.
- **NE PAS** faire de refactor global hors du scope du test cible.
- Respecter l'architecture hexagonale du repo (domain/application/infrastructure).
- Garder le code TypeScript propre et explicite ; éviter `any` sauf blocage temporaire strictement nécessaire.

CRITICAL:
- Le refactor doit suivre la boucle : `modifier -> tester -> valider -> continuer`.
- Si un test est rouge à une micro-étape, l'agent doit corriger avant toute autre modification.
- La sortie doit être un JSON valide et uniquement du JSON.

## Exemples négatifs (interdits)
- Interdit : conserver une logique métier dans la classe de test à la fin du refactor.
- Interdit : renommer le test ciblé ou changer ses assertions métier pour faciliter le passage au vert.
- Interdit : lancer des modifications cosmétiques non liées au scénario (reformat global, renommage massif, nettoyage transversal).
- Interdit : répondre en texte libre.

## Exemples

### Exemple 1
Input:
```json
{
  "green_output": {
    "status": "passed",
    "test": {
      "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
      "name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
    },
    "verification": { "result": "pass" },
    "handoff": { "ready_for_refactor": true }
  }
}
```

Expected output (JSON):
```json
{
  "status": "passed",
  "input": {
    "test_file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
    "test_name": "given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned"
  },
  "micro_steps": [
    {
      "index": 1,
      "change_summary": "Move temporary order creation logic from test mock to production use case",
      "files_touched": ["src/domain/use-cases/place-order.use-case.ts"],
      "verification_command": "pnpm vitest run src/domain/use-cases/__tests__/place-order.use-case.test.ts -t \"given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned\"",
      "verification_result": "pass"
    },
    {
      "index": 2,
      "change_summary": "Remove obsolete in-test production stub and keep only fakes needed for isolation",
      "files_touched": ["src/domain/use-cases/__tests__/place-order.use-case.test.ts"],
      "verification_command": "pnpm vitest run src/domain/use-cases/__tests__/place-order.use-case.test.ts -t \"given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned\"",
      "verification_result": "pass"
    }
  ],
  "constraints": {
    "behavior_changed": false,
    "target_test_intent_modified": false,
    "out_of_scope_refactor": false,
    "all_micro_steps_validated": true
  },
  "verification": {
    "target_test": {
      "command": "pnpm vitest run src/domain/use-cases/__tests__/place-order.use-case.test.ts -t \"given an identified customer and a Mojito in stock, when placing an order for 1 Mojito, then order is created with status EN_ATTENTE and an id is returned\"",
      "result": "pass"
    },
    "test_file": {
      "command": "pnpm vitest run src/domain/use-cases/__tests__/place-order.use-case.test.ts",
      "result": "pass"
    }
  },
  "handoff": {
    "ready_for_next_red": true,
    "notes": "Refactor complete, temporary in-test production code removed"
  }
}
```

### Exemple 2
Input:
```json
{
  "green_output": {
    "status": "failed",
    "test": {
      "file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
      "name": "given an identified customer and a Mojito in stock..."
    },
    "handoff": { "ready_for_refactor": false }
  }
}
```

Expected output (JSON):
```json
{
  "status": "failed",
  "input": {
    "test_file": "src/domain/use-cases/__tests__/place-order.use-case.test.ts",
    "test_name": "given an identified customer and a Mojito in stock..."
  },
  "micro_steps": [],
  "constraints": {
    "behavior_changed": false,
    "target_test_intent_modified": false,
    "out_of_scope_refactor": false,
    "all_micro_steps_validated": false
  },
  "verification": {
    "target_test": {
      "command": "",
      "result": "fail"
    }
  },
  "failing_reason": "Green output is not eligible for refactor (status is not passed or handoff.ready_for_refactor is false)",
  "handoff": {
    "ready_for_next_red": false,
    "notes": "Run/fix Green step before Refactor"
  }
}
```

## Format de sortie obligatoire
Répondre **uniquement** avec un JSON valide conforme à cette structure :

```json
{
  "status": "passed | failed",
  "input": {
    "test_file": "string",
    "test_name": "string"
  },
  "micro_steps": [
    {
      "index": "number",
      "change_summary": "string",
      "files_touched": ["string"],
      "verification_command": "string",
      "verification_result": "pass | fail"
    }
  ],
  "constraints": {
    "behavior_changed": false,
    "target_test_intent_modified": false,
    "out_of_scope_refactor": false,
    "all_micro_steps_validated": true
  },
  "verification": {
    "target_test": {
      "command": "string",
      "result": "pass | fail"
    },
    "test_file": {
      "command": "string",
      "result": "pass | fail"
    }
  },
  "failing_reason": "string (optionnel)",
  "handoff": {
    "ready_for_next_red": "boolean",
    "notes": "string"
  }
}
```

## Critère d'acceptation Refactor
- Le comportement du test ciblé est conservé.
- Le code de production temporaire est retiré de la classe de test et placé dans les classes appropriées.
- Chaque micro-étape est validée par un test vert.
- Si un garde-fou est violé (`behavior_changed`, `target_test_intent_modified`, `out_of_scope_refactor`), la sortie doit être `status: "failed"`.
- Si une micro-étape n'est pas validée, la sortie doit être `status: "failed"` avec `failing_reason` indiquant l'étape et le test qui a échoué.
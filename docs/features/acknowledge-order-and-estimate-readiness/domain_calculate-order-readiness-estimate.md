# [Domain] Calculate order readiness estimate

**Layer**
Domain

**Context**
The domain must acknowledge orders and compute estimated readiness time using explicit preparation rules per drink/food category. The calculation must support mixed orders and meal parallelization rules.

**Acceptance Criteria**
- Domain acknowledges an order and produces an estimated readiness time.
- Non-alcoholic drinks contribute 1 minute per drink type.
- Normal alcoholic drinks contribute 2 minutes per drink.
- Premium alcoholic drinks contribute 3 minutes per drink.
- Snacks contribute 2 minutes per snack type.
- Meals contribute 10 minutes per meal type plus longest drink-preparation component.

```gherkin
Feature: Acknowledge order with readiness estimate

Scenario: 1 - Estimate for drinks-only mixed order
  Given an order with 1 non-alcoholic drink type, 2 normal alcoholic drinks, and 1 premium alcoholic drink
  When the bartender acknowledges the order
  Then the estimated readiness time is 1 plus 4 plus 3 minutes

Scenario: 2 - Estimate for order containing meals and drinks
  Given an order with 1 meal type and drinks where longest drink component is 4 minutes
  When the bartender acknowledges the order
  Then the estimated readiness time is 10 plus 4 minutes
```

**Notes**
- Related feature: acknowledge-order-and-estimate-readiness
- Related issues: application_expose-acknowledge-order-endpoint, infrastructure_publish-acknowledgement-and-eta-notifications

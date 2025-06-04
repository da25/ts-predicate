# ts-predicate

Object-oriented, lazy & complex predicate builder for TypeScript.

## Installation

Install the package from npm:

```bash
npm install ts-predicate
```

## Basic Usage

### Creating predicates

Create a predicate from a function or use one of the helpers.

```ts
import { Predicate } from 'ts-predicate';

const isEven = Predicate.of<number>(n => n % 2 === 0);
isEven.test(2); // true
```

### Composing predicates

Predicates can be combined using logical operators or the helper functions from
`predicate-util`.

```ts
import { greaterThan, lessThan } from 'ts-predicate/dist/utils/number-utils.js';
import { allOf } from 'ts-predicate/dist/utils/predicate-util.js';

const inRange = allOf([greaterThan(0), lessThan(10)]);

inRange.test(5);  // true
inRange.test(15); // false
```

### Array predicates

```ts
import { everyItem, someItems } from 'ts-predicate/dist/utils/array-utils.js';
import { even } from 'ts-predicate/dist/utils/number-utils.js';

const hasEven = someItems(even<number>());
hasEven.test([1, 2, 3]); // true
```

## API Overview

### Core

- `Predicate.of(fn)` – create a predicate from a function
- `Predicate.from(mapper, predicate)` – map a value before testing
- `test(value)` – evaluate the predicate
- `and(other)` – conjunction
- `or(other)` – disjunction
- `not()` – negate

### Predicate utilities

- `predicate(fn)` – alias of `Predicate.of`
- `then(mapper, predicate)` – map then test
- `not(predicate)` – negation
- `allOf([predicates])` – logical AND over many predicates
- `anyOf([predicates])` – logical OR over many predicates
- `noneOf([predicates])` – negated `anyOf`

### Number utilities

- `lessThan`
- `greaterThan`
- `greaterThanOrEqualTo`
- `lessThanOrEqualTo`
- `withinBound`
- `negative`
- `positive`
- `divisibleBy`
- `even`
- `odd`

### Array utilities

- `hasSize`
- `isEmptyArray`
- `everyItem`
- `someItems`
- `noneItems`
- `atLeastItems`
- `atMostItems`
- `includesItem`
- `countItems`
- `reduceItems`

### Object utilities

- `equalTo`
- `isNull`
- `isUndefined`
- `hasProperty`

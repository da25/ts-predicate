import { Predicate } from '../predicate.js';
import { equalTo, hasProperty } from './object-utils.js';
import {
  greaterThan,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
} from './number-utils.js';
import { ReducerFunction } from '../types.js';

export function hasSize<T>(
  sizePredicate: Predicate<number>,
): Predicate<Array<T>> {
  return hasProperty<Array<T>, 'length'>('length', sizePredicate);
}

export function everyItem<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, (value: Array<T>) =>
    equalTo(value.length),
  );
}

export function someItems<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, greaterThan(0));
}

export function noneItems<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, equalTo(0));
}

export function atLeastItems<T>(
  itemPredicate: Predicate<T>,
  occurrenceCount: number,
): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, greaterThanOrEqualTo(occurrenceCount));
}

export function atMostItems<T>(
  itemPredicate: Predicate<T>,
  occurrenceCount: number,
): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, lessThanOrEqualTo(occurrenceCount));
}

export function includesItem<T>(item: T): Predicate<Array<T>> {
  return someItems<T>(equalTo<T>(item));
}

// export function count<T>(itemPredicate: Predicate<T>, countPredicate: Predicate<number>): Predicate<Array<T>>;
// export function count<T>(itemPredicate: Predicate<T>, countPredicate: (value: Array<T>) => Predicate<number>): Predicate<Array<T>>;
export function countItems<T>(
  itemPredicate: Predicate<T>,
  countPredicate: Predicate<number> | ((value: Array<T>) => Predicate<number>),
): Predicate<Array<T>> {
  const reducer: ReducerFunction<T, number> = (
    count: number,
    item: T,
  ): number => (itemPredicate.test(item) ? count + 1 : count);

  return reduceItems<T, number>(countPredicate, reducer, 0);
}

// export function reduce<T, U = T>(
//   reducedPredicate: Predicate<U>,
//   reducer: ReducerFunction<T, U>,
// ): Predicate<Array<T>>;
// export function reduce<T, U = T>(
//   reducedPredicate: Predicate<U>,
//   reducer: ReducerFunction<T, U>,
//   initialValue: U
// ): Predicate<Array<T>>;
// export function reduce<T, U = T>(
//   reducedPredicate: (value: Array<T>) => Predicate<U>,
//   reducer: ReducerFunction<T, U>,
// ): Predicate<Array<T>>;
// export function reduce<T, U = T>(
//   reducedPredicate: (value: Array<T>) => Predicate<U>,
//   reducer: ReducerFunction<T, U>,
//   initialValue: U
// ): Predicate<Array<T>>;
// export function reduce<T, U>(
//   reducedPredicate: Predicate<U>,
//   reducer: ReducerFunction<T, U>,
//   initialValue: U
// ): Predicate<Array<T>>;
// export function reduce<T, U>(
//   reducedPredicate: (value: Array<T>) => Predicate<U>,
//   reducer: ReducerFunction<T, U>,
//   initialValue: U
// ): Predicate<Array<T>>;
export function reduceItems<T, U>(
  reducedPredicate: Predicate<U> | ((value: Array<T>) => Predicate<U>),
  reducer: ReducerFunction<T, U>,
  initialValue?: U,
): Predicate<Array<T>> {
  return Predicate.from<Array<T>, U>((value: Array<T>) => {
    if (initialValue === undefined || initialValue === null) {
      if (value.length > 0) {
        initialValue = value.shift() as unknown as U;
      } else {
        throw Error('No initialValue provided and array is empty');
      }
    }
    return value.reduce<U>(reducer, initialValue);
  }, reducedPredicate);
}

import { Predicate } from '../predicate.js';
import { equalTo, hasProperty } from './object-utils.js';
import { greaterThan, greaterThanOrEqualTo, lessThanOrEqualTo } from './number-utils.js';
import { ReducerFunction } from '../types.js';

export function hasSize<T>(sizePredicate: Predicate<number>): Predicate<Array<T>> {
  return hasProperty<Array<T>, 'length'>('length', sizePredicate);
}

export function every<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return count<T>(itemPredicate, (value: Array<T>) => equalTo(value.length));
}

export function some<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return count<T>(itemPredicate, greaterThan(0));
}

export function none<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return count<T>(itemPredicate, equalTo(0));
}

export function atLeast<T>(itemPredicate: Predicate<T>, occurrenceCount: number): Predicate<Array<T>> {
  return count<T>(itemPredicate, greaterThanOrEqualTo(occurrenceCount));
}

export function atMost<T>(itemPredicate: Predicate<T>, occurrenceCount: number): Predicate<Array<T>> {
  return count<T>(itemPredicate, lessThanOrEqualTo(occurrenceCount));
}

export function includes<T>(item: T): Predicate<Array<T>> {
  return some<T>(equalTo<T>(item));
}

// export function count<T>(itemPredicate: Predicate<T>, countPredicate: Predicate<number>): Predicate<Array<T>>;
// export function count<T>(itemPredicate: Predicate<T>, countPredicate: (value: Array<T>) => Predicate<number>): Predicate<Array<T>>;
export function count<T>(
  itemPredicate: Predicate<T>,
  countPredicate: Predicate<number> | ((value: Array<T>) => Predicate<number>)
): Predicate<Array<T>> {
  const reducer: ReducerFunction<T, number> = (count: number, item: T): number =>
    itemPredicate.test(item) ? count + 1 : count;

  return reduce<T, number>(countPredicate, reducer, 0);
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
export function reduce<T, U>(
  reducedPredicate: Predicate<U> | ((value: Array<T>) => Predicate<U>),
  reducer: ReducerFunction<T, U>,
  initialValue?: U
): Predicate<Array<T>> {
  return Predicate.from<Array<T>, U>(
    (value: Array<T>) => {
      if (initialValue === undefined || initialValue === null) {
        if (value.length > 0) {
          initialValue = (value.shift() as unknown as U);
        } else {
          throw Error('No initialValue provided and array is empty');
        }
      }
      return value.reduce<U>(reducer, initialValue)
    },
    reducedPredicate
  );
}

import { Predicate } from '../predicate.js';
import { PredicateFunction } from '../types.js';

export function predicate<T>(predicateFn: PredicateFunction<T>): Predicate<T> {
  return Predicate.of<T>(predicateFn);
}

export function then<T, U>(
  mapperFn: (value: T) => U,
  predicate: Predicate<U>,
): Predicate<T> {
  return Predicate.from<T, U>(mapperFn, predicate);
}

export function not<T>(predicate: Predicate<T>): Predicate<T> {
  return predicate.not();
}

export function allOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return predicates.reduce(
    (accumulator: Predicate<T>, current: Predicate<T>) => accumulator.and<T>(current)
  );
}

export function anyOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return predicates.reduce(
    (accumulator: Predicate<T>, current: Predicate<T>) => accumulator.or<T>(current)
  );
}

export function noneOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return not(anyOf<T>(predicates));
}

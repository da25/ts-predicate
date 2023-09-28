import { Predicate } from '../predicate.ts';
import { PredicateFunction, XOR } from '../types.ts';
import { equalTo } from './object-utils.ts';
import { greaterThanOrEqualTo, lessThanOrEqualTo } from './number-utils.ts';

export function truePredicate<T = unknown>(): Predicate<T> {
  return Predicate.of<T>(() => true);
}

export function falsePredicate<T = unknown>(): Predicate<T> {
  return Predicate.of<T>(() => false);
}

export function asPredicate<T>(): Predicate<T> {
  return Predicate.of<T>((value: T) => Boolean(value));
}
export function predicate<T>(predicateFn: PredicateFunction<T>): Predicate<T> {
  return Predicate.of<T>(predicateFn);
}

export function and<T, U>(
  predicate1: Predicate<T>,
  predicate2: Predicate<U>,
): Predicate<T & U> {
  return predicate1.and<U>(predicate2);
}

export function or<T, U>(
  predicate1: Predicate<T>,
  predicate2: Predicate<U>,
): Predicate<T | U> {
  return predicate1.or<U>(predicate2);
}

export function not<T>(predicate: Predicate<T>): Predicate<T> {
  return predicate.not();
}

export function then<T, U>(
  mapperFn: (value: T) => U,
  predicate: Predicate<U>,
): Predicate<T> {
  return Predicate.from<T, U>(mapperFn, predicate);
}

export function noneOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return not(anyOf<T>(predicates));
}

export function atLeastOf<T>(
  predicates: Array<Predicate<T>>,
  occurrenceCount: number,
): Predicate<T> {
  return countOf<T>(predicates, greaterThanOrEqualTo(occurrenceCount));
}

export function oneOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return countOf<T>(predicates, equalTo(1));
}

export function atMostOf<T>(
  predicates: Array<Predicate<T>>,
  occurrenceCount: number,
): Predicate<T> {
  return countOf<T>(predicates, lessThanOrEqualTo(occurrenceCount));
}

export function anyOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return Predicate.of<T>((value: T) =>
    predicates.some((pred: Predicate<T>) => pred.test(value)),
  );
}

export function allOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return Predicate.of<T>((value: T) =>
    predicates.every((pred: Predicate<T>) => pred.test(value)),
  );
}

export function countOf<T>(
  predicates: Array<Predicate<T>>,
  countPredicate: Predicate<number>,
): Predicate<T> {
  return Predicate.of<T>((value: T) =>
    countPredicate.test(
      predicates.reduce<number>(
        (count: number, predicate: Predicate<T>) =>
          predicate.test(value) ? count + 1 : count,
        0,
      ),
    ),
  );
}

export function xor<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return Predicate.of<T>((value: T) =>
    predicates.reduce<boolean>(
      (accumulator: boolean, predicate: Predicate<T>) =>
        accumulator !== predicate.test(value),
      false,
    ),
  );
}

export function either<T, U>(
  predicate1: Predicate<XOR<T, U>>,
  predicate2: Predicate<XOR<T, U>>,
): Predicate<T | U> {
  return oneOf<XOR<T, U>>([predicate1, predicate2]);
}

export function neither<T, U>(
  predicate1: Predicate<T>,
  predicate2: Predicate<U>,
): Predicate<T | U> {
  return noneOf<T | U>([predicate1, predicate2]);
}

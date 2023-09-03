import { Predicate } from '../predicate.js';
import { equalTo } from './object-utils.js';
import { allOf, anyOf, not } from './predicate-util.js';

export function lessThan<T extends number, U extends number>(
  comparisonValue: U,
): Predicate<T> {
  return Predicate.of<T>((value: T) => value < comparisonValue);
}

export function greaterThan<T extends number, U extends number>(
  comparisonValue: U,
): Predicate<T> {
  return Predicate.of<T>((value: T) => value > comparisonValue);
}

export function greaterThanOrEqualTo<T extends number, U extends number>(
  comparisonValue: U,
): Predicate<T> {
  return anyOf([
    greaterThan<number, number>(comparisonValue),
    equalTo<number>(comparisonValue)
  ]);
}

export function lessThanOrEqualTo<T extends number, U extends number>(
  comparisonValue: U,
): Predicate<T> {
  return anyOf([
    lessThan<number, number>(comparisonValue),
    equalTo<number>(comparisonValue)
  ]);
}

export function withinBound<T extends number, U extends number>(
  lowerBound: U,
  upperBound: U,
): Predicate<T> {
  return allOf([
    greaterThanOrEqualTo<number, number>(lowerBound),
    lessThanOrEqualTo<number, number>(upperBound)
  ]);
}

export function negative<T extends number>(): Predicate<T> {
  return lessThan<T, number>(0);
}

export function positive<T extends number>(): Predicate<T> {
  return greaterThan<T, number>(0);
}

export function divisibleBy<T extends number, U extends number>(
  divisor: U
): Predicate<T> {
  return Predicate.from<T, number>((value: T) => value % divisor,
    equalTo<number>(0)
  );
}

export function even<T extends number>(): Predicate<T> {
  return divisibleBy<T, number>(2);
}

export function odd<T extends number>(): Predicate<T> {
  return not<T>(even<T>())
}

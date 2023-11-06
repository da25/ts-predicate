import { Predicate } from '../predicate.ts';
import { equalTo } from './object-utils.ts';
import { not } from './predicate-util.ts';

export function lessThan<T extends number = number, U extends number = T>(
  comparisonValue: U,
): Predicate<T> {
  return Predicate.of<T>((value: T) => value < comparisonValue);
}

export function greaterThan<T extends number = number, U extends number = T>(
  comparisonValue: U,
): Predicate<T> {
  return Predicate.of<T>((value: T) => value > comparisonValue);
}

export function greaterThanOrEqualTo<
  T extends number = number,
  U extends number = T,
>(comparisonValue: U): Predicate<T> {
  return Predicate.of<T>((value: T) => value >= comparisonValue);
}

export function lessThanOrEqualTo<
  T extends number = number,
  U extends number = T,
>(comparisonValue: U): Predicate<T> {
  return Predicate.of<T>((value: T) => value <= comparisonValue);
}

export function withinBound<T extends number = number, U extends number = T>(
  lowerBound: U,
  upperBound: U,
): Predicate<T> {
  return Predicate.of<T>(
    (value: T) => value >= lowerBound && value <= upperBound,
  );
}

export function negative<T extends number = number>(): Predicate<T> {
  return lessThan<T, number>(0);
}

export function positive<T extends number = number>(): Predicate<T> {
  return greaterThan<T, number>(0);
}

export function divisibleBy<T extends number = number, U extends number = T>(
  divisor: U,
): Predicate<T> {
  return Predicate.from<T, number>(
    (value: T) => value % divisor,
    equalTo<number>(0),
  );
}

export function even<T extends number = number>(): Predicate<T> {
  return divisibleBy<T, number>(2);
}

export function odd<T extends number = number>(): Predicate<T> {
  return not<T>(even<T>());
}

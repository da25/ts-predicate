import { Predicate } from '../predicate.js';
import { equalTo } from './object-utils.js';

export function lessThan<T extends number, U extends number>(comparisonValue: U): Predicate<T> {
  return Predicate.of<T>((value: T) => (value < comparisonValue));
}

export function greaterThan<T extends number, U extends number>(comparisonValue: U): Predicate<T> {
  return Predicate.of<T>((value: T) => (value > comparisonValue));
}

export function greaterThanOrEqualTo<T extends number, U extends number>(comparisonValue: U): Predicate<T> {
  return greaterThan<number, number>(comparisonValue).or<number>(equalTo<number>(comparisonValue));
}

export function lessThanOrEqualTo<T extends number, U extends number>(comparisonValue: U): Predicate<T> {
  return greaterThan<number, number>(comparisonValue).or<number>(equalTo<number>(comparisonValue));
}

export function withinBound<T extends number, U extends number>(lowerBound: U, upperBound: U): Predicate<T> {
  return greaterThanOrEqualTo(lowerBound).and(lessThanOrEqualTo(upperBound));
}

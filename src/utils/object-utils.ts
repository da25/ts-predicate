import { Predicate } from '../predicate.js';

export function equalTo<T>(comparisonValue: T): Predicate<T> {
  return Predicate.of<T>((value: T) => (value === comparisonValue));
}

export function isNull<T>(): Predicate<T|null> {
  return equalTo<T|null>(null);
}

export function isUndefined<T>(): Predicate<T|undefined> {
  return equalTo<T|undefined>(undefined);
}

export function hasProperty<T, K extends keyof T = keyof T>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  property: T[K] extends Function ? never : K,
  propertyPredicate: Predicate<T[K]>
): Predicate<T> {
  return Predicate.from<T, T[K]>((value: T) => value[property] as T[K], propertyPredicate);
}

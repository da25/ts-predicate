import { Predicate } from '../predicate.ts';
import { BooleanKeys, FunctionKeys, KeyTypes, ReturnTypeOf } from '../types.ts';
import { asPredicate } from './predicate-util.ts';

export function equalTo<T>(comparisonValue: T): Predicate<T> {
  return Predicate.of<T>((value: T) => value === comparisonValue);
}

export function isNull<T>(): Predicate<T | null> {
  return equalTo<T | null>(null);
}

export function isUndefined<T>(): Predicate<T | undefined> {
  return equalTo<T | undefined>(undefined);
}

export function hasProperty<
  T,
  K extends Exclude<keyof T, FunctionKeys<T>> = Exclude<
    keyof T,
    FunctionKeys<T>
  >,
>(property: K, propertyPredicate: Predicate<T[K]>): Predicate<T> {
  return Predicate.from<T, T[K]>(
    (value: T) => value[property],
    propertyPredicate,
  );
}

export function hasPropertyPredicate<
  T,
  K extends Exclude<BooleanKeys<T>, FunctionKeys<T>> = Exclude<
    BooleanKeys<T>,
    FunctionKeys<T>
  >,
>(property: K): Predicate<T> {
  return hasProperty<T, K>(property, asPredicate());
}

export function invokeProperty<T, K extends KeyTypes<T, () => unknown>>(
  functionName: K,
  propertyPredicate: Predicate<ReturnTypeOf<T, typeof functionName>>,
): Predicate<T> {
  return Predicate.from<T, ReturnTypeOf<T, typeof functionName>>(
    (value: T) =>
      (value[functionName] as () => ReturnTypeOf<T, typeof functionName>)(),
    propertyPredicate,
  );
}

export function invokePropertyPredicate<
  T,
  K extends Extract<KeyTypes<T, () => unknown>, KeyTypes<T, () => boolean>>,
>(functionName: K): Predicate<T> {
  return invokeProperty<T, K>(functionName, asPredicate());
}

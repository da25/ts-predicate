import { Predicate } from '../predicate.ts';
import {
  BooleanKeys,
  FunctionKeys,
  KeyTypes,
  PredicateRecursiveRecord,
  RecursiveRecord,
  ReturnTypeOf,
} from '../types.ts';
import { allOf, asPredicate } from './predicate-util.ts';

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

export function hasPropertyAsPredicate<
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

export function invokePropertyAsPredicate<
  T,
  K extends Extract<KeyTypes<T, () => unknown>, KeyTypes<T, () => boolean>>,
>(functionName: K): Predicate<T> {
  return invokeProperty<T, K>(functionName, asPredicate());
}

export function predicateRecord<T extends RecursiveRecord<string, any>>(
  predicateRecordObj: PredicateRecursiveRecord<T>,
): Predicate<T> {
  return allOf<T>(
    Object.entries(predicateRecordObj).map<Predicate<T>>(([key, value]) => {
      const valuePredicate: Predicate<typeof value> =
        value instanceof Predicate
          ? value
          : predicateRecord<typeof value>(value);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return hasProperty<T>(key, valuePredicate);
    }),
  );
}

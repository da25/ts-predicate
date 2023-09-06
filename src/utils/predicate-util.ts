import { Predicate } from '../predicate.js';

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
  return Predicate.of<T>((value: T) =>
    predicates.every((pred: Predicate<T>) => pred.test(value)),
  );
}

export function anyOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return Predicate.of<T>((value: T) =>
    predicates.some((pred: Predicate<T>) => pred.test(value)),
  );
}

export function noneOf<T>(predicates: Array<Predicate<T>>): Predicate<T> {
  return not(anyOf<T>(predicates));
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

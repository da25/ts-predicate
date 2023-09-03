import { PredicateFunction } from './types.js';

export class Predicate<T> {
  readonly #predicateFn: PredicateFunction<T>;

  constructor(predicateFn: PredicateFunction<T>) {
    this.#predicateFn = predicateFn;
  }

  public test(value: T): boolean {
    return this.#predicateFn(value);
  }

  public and<U>(other: Predicate<U>): Predicate<T & U> {
    return new Predicate<T & U>(
      (value: T & U) => this.test(value) && other.test(value),
    );
  }

  public or<U>(other: Predicate<U>): Predicate<T | U> {
    return new Predicate<T | U>(
      (value: T | U) => this.test(value as T) || other.test(value as U),
    );
  }

  public not(): Predicate<T> {
    return new Predicate<T>((value: T) => !this.test(value));
  }

  public static of<T>(predicateFn: PredicateFunction<T>): Predicate<T> {
    return new Predicate<T>(predicateFn);
  }

  static from<T, U>(mapperFn: (value: T) => U, predicate: Predicate<U>): Predicate<T>;
  static from<T, U>(mapperFn: (value: T) => U, predicateMapperFn: (value: T) => Predicate<U>): Predicate<T>;
  static from<T, U>(
    mapperFn: (value: T) => U,
    predicateOrMapperFn: Predicate<U> | ((value: T) => Predicate<U>),
  ): Predicate<T> {
    if (predicateOrMapperFn instanceof Predicate) {
      return new Predicate<T>((value: T) =>
        predicateOrMapperFn.test(mapperFn(value)),
      );
    } else {
      return new Predicate<T>((value: T) =>
        predicateOrMapperFn(value).test(mapperFn(value)),
      );
    }
  }
}

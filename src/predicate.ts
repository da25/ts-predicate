import { PredicateFunction } from './types.ts';

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
      (value: T & U) => this.#predicateFn(value) && other.#predicateFn(value),
    );
  }

  public or<U>(other: Predicate<U>): Predicate<T | U> {
    return new Predicate<T | U>(
      (value: T | U) =>
        this.#predicateFn(value as T) || other.#predicateFn(value as U),
    );
  }

  public not(): Predicate<T> {
    return new Predicate<T>((value: T) => !this.#predicateFn(value));
  }

  public static of<T>(predicateFn: PredicateFunction<T>): Predicate<T> {
    return new Predicate<T>(predicateFn);
  }

  static from<T, U>(
    mapperFn: (value: T) => U,
    predicate: Predicate<U>,
  ): Predicate<T> {
    return new Predicate<T>((value: T) =>
      predicate.#predicateFn(mapperFn(value)),
    );
  }
}

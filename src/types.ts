export type PredicateFunction<T> = (value: T) => boolean;
export type ReducerFunction<T, U> = (
  previousValue: U,
  currentValue: T,
  currentIndex: number,
  array: T[],
) => U;

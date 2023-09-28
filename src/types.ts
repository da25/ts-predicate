export type PredicateFunction<T> = (value: T) => boolean;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T | U extends object
  ? Prettify<Without<T, U> & U> | Prettify<Without<U, T> & T>
  : T | U;

export type ReducerFunction<T, U> = (
  previousValue: U,
  currentValue: T,
  currentIndex: number,
  array: T[],
) => U;

export interface Something {
  name: string;
  value: number;
  isReady: boolean;
  isEmpty: boolean;
  getValue: () => number;
  double: (val: number) => number;
  isFinal: () => boolean
}

export type KeyTypes<T, KeyType> = {
  [K in keyof T]: T[K] extends KeyType ? K : never;
}[keyof T];

export type BooleanKeys<T> = KeyTypes<T, boolean>;

export type FunctionKeys<T> = KeyTypes<T, Function>;

export type NonFunctionKeys<T> = Exclude<keyof T, FunctionKeys<T>>;

export type IsBoolean<T, K extends keyof T> = T[K] extends boolean ? T : never;

export type IsFunction<T> = T extends Function ? T : never;

export type UniFunction<I, O> = (input: I) => O;

export type ArrayFunctions<T> = FunctionKeys<Array<T>>;

export type ArrayNonFunctions<T> = NonFunctionKeys<Array<T>>;

export type ReturnTypeOf<T, K extends keyof T> = T[K] extends (
  ...args: any[]
) => infer R
  ? R
  : never;

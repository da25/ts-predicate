import { Predicate } from '../predicate.ts';
import { equalTo, hasProperty } from './object-utils.ts';
import { greaterThanOrEqualTo, lessThanOrEqualTo } from './number-utils.ts';
import { not } from './predicate-util.ts';

export function hasSize<T>(
  sizePredicate: Predicate<number>,
): Predicate<Array<T>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return hasProperty<Array<T>, 'length'>('length', sizePredicate);
}

export function isEmptyArray<T>(): Predicate<Array<T>> {
  return hasSize<T>(equalTo(0));
}

export function everyItem<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return Predicate.of<Array<T>>((value: Array<T>) =>
    value.every((item: T) => itemPredicate.test(item)),
  );
}

export function anyItem<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return Predicate.of<Array<T>>((value: Array<T>) =>
    value.some((item: T) => itemPredicate.test(item)),
  );
}

export function noneItem<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return not(anyItem(itemPredicate));
}

export function oneItem<T>(itemPredicate: Predicate<T>): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, equalTo(1));
}

export function atLeastItems<T>(
  itemPredicate: Predicate<T>,
  occurrenceCount: number,
): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, greaterThanOrEqualTo(occurrenceCount));
}

export function atMostItems<T>(
  itemPredicate: Predicate<T>,
  occurrenceCount: number,
): Predicate<Array<T>> {
  return countItems<T>(itemPredicate, lessThanOrEqualTo(occurrenceCount));
}

export function includesItem<T>(
  itemPredicate: Predicate<T>,
): Predicate<Array<T>> {
  return anyItem<T>(itemPredicate);
}

export function countItems<T>(
  itemPredicate: Predicate<T>,
  countPredicate: Predicate<number>,
): Predicate<Array<T>> {
  return Predicate.from<Array<T>, number>(
    (value: Array<T>) =>
      value.reduce<number>(
        (count: number, currentItem: T) =>
          itemPredicate.test(currentItem) ? count + 1 : count,
        0,
      ),
    countPredicate,
  );
}

export function hasDistinctItems<T>(): Predicate<Array<T>> {
  return Predicate.of<Array<T>>(
    (value: Array<T>) => new Set(value).size === value.length,
  );
}

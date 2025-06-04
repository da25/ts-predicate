import {
  atLeastItems,
  atMostItems,
  everyItem,
  hasSize,
  includesItem,
  noneItems,
  reduceItems,
  someItems,
} from '../src/utils/array-utils.js';
import {
  even,
  greaterThan,
  lessThan,
  withinBound,
  negative,
} from '../src/utils/number-utils.js';
import { equalTo } from '../src/utils/object-utils.js';
import { allOf, noneOf } from '../src/utils/predicate-util.js';

describe('predicates', () => {
  let arr: number[];

  beforeEach(() => {
    arr = [2, 5, 9, 4, 7];
  });

  it('test array utils', () => {
    const arr: number[] = [2, 5, 9, 4, 7];
    expect(includesItem(equalTo(1)).test(arr)).toBeFalsy();
    expect(includesItem(equalTo(5)).test(arr)).toBeTruthy();
    expect(everyItem(lessThan(10)).test(arr)).toBeTruthy();
    expect(someItems(greaterThan(6)).test(arr)).toBeTruthy();
    expect(noneItems(greaterThan(10)).test(arr)).toBeTruthy();
    expect(atLeastItems(greaterThan(6), 2).test(arr)).toBeTruthy();
    expect(atMostItems(lessThan(6), 3).test(arr)).toBeTruthy();
    expect(hasSize(equalTo(5)).test(arr)).toBeTruthy();
  });

  it('should work with complex predicates', () => {
    expect(
      allOf([
        everyItem(withinBound(0, 10)),
        someItems(even())
      ]).test(arr)
    ).toBeTruthy();
  });

  it('should test everyItem(withinBound)', () => {
    expect(
      everyItem(withinBound(0, 10)).test(arr)
    ).toBeTruthy()
  });

  it('should test someItems(even())', () => {
    expect(
      someItems(even()).test(arr)
    ).toBeTruthy()
  });

  it('reduceItems should not mutate array when initial value is omitted', () => {
    const numbers = [1, 2, 3];
    const sumEqualsSix = reduceItems<number, number>(
      equalTo(6),
      (acc, current) => acc + current
    );
    expect(sumEqualsSix.test(numbers)).toBeTruthy();
    expect(numbers).toEqual([1, 2, 3]);
  });
  it('reduceItems throws on empty array without initial value', () => {
    const reducer = (sum: number, val: number): number => sum + val;
    const predicate = reduceItems<number, number>(equalTo(0), reducer);
    expect(() => predicate.test([])).toThrow('No initialValue provided and array is empty');
  });

  it('handles negative bounds in number predicates', () => {
    expect(greaterThan(-10).test(-5)).toBeTruthy();
    expect(withinBound(-10, -1).test(-5)).toBeTruthy();
    expect(withinBound(-10, -1).test(0)).toBeFalsy();
    expect(negative<number>().test(-3)).toBeTruthy();
  });

  it('uses noneOf to combine predicates', () => {
    const pred = noneOf<number>([greaterThan(10), lessThan(0)]);
    expect(pred.test(5)).toBeTruthy();
    expect(pred.test(11)).toBeFalsy();
  });
});

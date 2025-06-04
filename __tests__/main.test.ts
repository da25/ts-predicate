import {
  atLeastItems,
  atMostItems,
  everyItem,
  hasSize,
  includesItem,
  noneItems,
  someItems,
} from '../src/utils/array-utils.js';
import { even, greaterThan, lessThan, withinBound } from '../src/utils/number-utils.js';
import { equalTo } from '../src/utils/object-utils.js';
import { allOf } from '../src/utils/predicate-util.js';

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
      someItems(even())
    ).toBeTruthy()
  });
});

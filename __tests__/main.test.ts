import {
  atLeastItems,
  atMostItems,
  everyItem,
  hasSize,
  includesItem,
  noneItems,
  someItems,
} from '../src/utils/array-utils.js';
import { greaterThan, lessThan } from '../src/utils/number-utils.js';
import { equalTo } from '../src/utils/object-utils.js';

describe('greeter function', () => {
  it('test array utils', () => {
    const arr: number[] = [2, 5, 9, 4, 7];
    expect(includesItem(1).test(arr)).toBeFalsy();
    expect(includesItem(5).test(arr)).toBeTruthy();
    expect(everyItem(lessThan(10)).test(arr)).toBeTruthy();
    expect(someItems(greaterThan(6)).test(arr)).toBeTruthy();
    expect(noneItems(greaterThan(10)).test(arr)).toBeTruthy();
    expect(atLeastItems(greaterThan(6), 2).test(arr)).toBeTruthy();
    expect(atMostItems(lessThan(6), 3).test(arr)).toBeTruthy();
    expect(hasSize(equalTo(5)).test(arr)).toBeTruthy();
  });
});

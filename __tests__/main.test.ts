import { atLeast, atMost, every, hasSize, includes, none, some } from '../src/utils/array-utils.js';
import { greaterThan, lessThan } from '../src/utils/number-utils.js';
import { equalTo } from '../src/utils/object-utils.js';

describe('greeter function', () => {

  it('test array utils', () => {
    const arr: number[] = [2, 5, 9, 4, 7];
    expect(includes(1).test(arr)).toBeFalsy();
    expect(includes(5).test(arr)).toBeTruthy();
    expect(every(lessThan(10)).test(arr)).toBeTruthy();
    expect(some(greaterThan(6)).test(arr)).toBeTruthy();
    expect(none(greaterThan(10)).test(arr)).toBeTruthy();
    expect(atLeast(greaterThan(6), 2).test(arr)).toBeTruthy();
    expect(atMost(lessThan(6), 3).test(arr)).toBeTruthy();
    expect(hasSize(equalTo(5)).test(arr)).toBeTruthy();
  });
});

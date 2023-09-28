import {
  atLeastItems,
  atMostItems,
  everyItem,
  hasSize,
  includesItem,
  noneItems,
  someItems,
} from '../src/utils/array-utils.ts';
import {
  even,
  greaterThan,
  lessThan,
  withinBound,
} from '../src/utils/number-utils.ts';
import { equalTo, invokingPropertyPredicate } from '../src/utils/object-utils.ts';
import { allOf } from '../src/utils/predicate-util.ts';
import { Something } from '../src/types.ts';

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
      allOf([everyItem(withinBound(0, 10)), someItems(even())]).test(arr),
    ).toBeTruthy();
  });

  it('havingPropertyPredicate', () => {
    expect(
      invokingPropertyPredicate<Something, 'isFinal'>('isFinal').test({
        name: 'g',
        get isReady() {
          return true;
        },
        value: 4,
        isEmpty: false,
        getValue: () => 4,
        double: (val: number) => val * 2,
        isFinal: () => true
      }),
    ).toBeTruthy();
  });

  it('should test everyItem(withinBound))', () => {
    expect(everyItem(withinBound(0, 10)).test(arr)).toBeTruthy();
  });

  it('should test someItems(even())', () => {
    expect(someItems(even())).toBeTruthy();
  });
});

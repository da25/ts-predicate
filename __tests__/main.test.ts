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
import { Predicate } from '../src/predicate.js';

describe('Predicate Utilities', () => {
  let arr: number[];

  beforeEach(() => {
    arr = [2, 5, 9, 4, 7];
  });

  it('should correctly apply various array utility predicates', () => {
    expect(includesItem(equalTo(1)).test(arr)).toBeFalsy();
    expect(includesItem(equalTo(5)).test(arr)).toBeTruthy();
    expect(everyItem(lessThan(10)).test(arr)).toBeTruthy();
    expect(someItems(greaterThan(6)).test(arr)).toBeTruthy();
    expect(noneItems(greaterThan(10)).test(arr)).toBeTruthy();
    expect(atLeastItems(greaterThan(6), 2).test(arr)).toBeTruthy();
    expect(atMostItems(lessThan(6), 3).test(arr)).toBeTruthy();
    expect(hasSize(equalTo(5)).test(arr)).toBeTruthy();
  });

  it('should correctly apply allOf with multiple utility predicates', () => {
    expect(
      allOf([
        everyItem(withinBound(0, 10)), // All items in arr are between 0 and 10
        someItems(even())             // At least one item in arr is even
      ]).test(arr)
    ).toBeTruthy();
  });
});

describe('Predicate', () => {
  describe('and', () => {
    const truePredicate = Predicate.of<unknown>(() => true);
    const falsePredicate = Predicate.of<unknown>(() => false);

    it('should return true when both predicates are true', () => {
      expect(truePredicate.and(truePredicate).test(null)).toBe(true);
    });

    it('should return false when the first predicate is true and the second is false', () => {
      expect(truePredicate.and(falsePredicate).test(null)).toBe(false);
    });

    it('should return false when the first predicate is false and the second is true', () => {
      expect(falsePredicate.and(truePredicate).test(null)).toBe(false);
    });

    it('should return false when both predicates are false', () => {
      expect(falsePredicate.and(falsePredicate).test(null)).toBe(false);
    });

    it('should return true when all predicates in a chain are true', () => {
      expect(truePredicate.and(truePredicate).and(truePredicate).test(null)).toBe(true);
    });

    it('should return false when at least one predicate in a chain is false', () => {
      expect(truePredicate.and(falsePredicate).and(truePredicate).test(null)).toBe(false);
    });
  });

  describe('or', () => {
    const truePredicate = Predicate.of<unknown>(() => true);
    const falsePredicate = Predicate.of<unknown>(() => false);

    it('should return true when both predicates are true', () => {
      expect(truePredicate.or(truePredicate).test(null)).toBe(true);
    });

    it('should return true when the first predicate is true and the second is false', () => {
      expect(truePredicate.or(falsePredicate).test(null)).toBe(true);
    });

    it('should return true when the first predicate is false and the second is true', () => {
      expect(falsePredicate.or(truePredicate).test(null)).toBe(true);
    });

    it('should return false when both predicates are false', () => {
      expect(falsePredicate.or(falsePredicate).test(null)).toBe(false);
    });

    it('should return true when at least one predicate in a chain is true', () => {
      expect(falsePredicate.or(truePredicate).or(falsePredicate).test(null)).toBe(true);
    });

    it('should return false when all predicates in a chain are false', () => {
      expect(falsePredicate.or(falsePredicate).or(falsePredicate).test(null)).toBe(false);
    });
  });

  describe('not', () => {
    const truePredicate = Predicate.of<unknown>(() => true);
    const falsePredicate = Predicate.of<unknown>(() => false);

    it('should return false when the predicate is true', () => {
      expect(truePredicate.not().test(null)).toBe(false);
    });

    it('should return true when the predicate is false', () => {
      expect(falsePredicate.not().test(null)).toBe(true);
    });
  });

  describe('from', () => {
    it('should correctly map input and apply predicate', () => {
      const mapperFn = (obj: { value: number }) => obj.value;
      const valuePredicate = Predicate.of((n: number) => n > 10);
      const combinedPredicate = Predicate.from(mapperFn, valuePredicate);

      expect(combinedPredicate.test({ value: 15 })).toBe(true);
      expect(combinedPredicate.test({ value: 5 })).toBe(false);
    });

    it('should correctly use a function that returns a predicate based on input T', () => {
      const mapperFn = (obj: { type: string; value: number }) => obj.value; // Maps T to U (number)

      // This function takes T (obj) and returns a Predicate<U> (Predicate<number>)
      const predicateProviderFn = (obj: { type: string; value: number }): Predicate<number> => {
        if (obj.type === 'A') {
          return Predicate.of((val: number) => val > 10); // Predicate for type 'A' objects
        } else {
          return Predicate.of((val: number) => val < 5);  // Predicate for other objects
        }
      };

      const combinedPredicate = Predicate.from(mapperFn, predicateProviderFn);

      // Type 'A', value 15. mapperFn -> 15. predicateProviderFn returns (val > 10). 15 > 10 is true.
      expect(combinedPredicate.test({ type: 'A', value: 15 })).toBe(true);
      // Type 'A', value 5. mapperFn -> 5. predicateProviderFn returns (val > 10). 5 > 10 is false.
      expect(combinedPredicate.test({ type: 'A', value: 5 })).toBe(false);
      // Type 'B', value 3. mapperFn -> 3. predicateProviderFn returns (val < 5). 3 < 5 is true.
      expect(combinedPredicate.test({ type: 'B', value: 3 })).toBe(true);
      // Type 'B', value 8. mapperFn -> 8. predicateProviderFn returns (val < 5). 8 < 5 is false.
      expect(combinedPredicate.test({ type: 'B', value: 8 })).toBe(false);
    });
  });

  describe('complex combinations', () => {
    it('should handle p1.and(p2).or(p3.not()) correctly', () => {
      const p1 = Predicate.of((n: number) => n > 5); // n > 5
      const p2 = Predicate.of((n: number) => n < 10); // n < 10
      const p3 = Predicate.of((n: number) => n % 2 === 0); // n is even

      // (n > 5 AND n < 10) OR (n is NOT even)
      const complexPredicate = p1.and(p2).or(p3.not());

      // 6: (true AND true) OR false -> true OR false -> true
      expect(complexPredicate.test(6)).toBe(true);
      // 4: p1(false) AND p2(true) -> false. p3(true) -> p3.not()(false). false OR false -> false
      expect(complexPredicate.test(4)).toBe(false);
      // 12: (true AND false) OR false -> false OR false -> false
      expect(complexPredicate.test(12)).toBe(false);
      // 11: (true AND false) OR true -> false OR true -> true
      expect(complexPredicate.test(11)).toBe(true);
      // 7: (true AND true) OR true -> true OR true -> true
      expect(complexPredicate.test(7)).toBe(true);
       // 5: (false AND true) OR true -> false OR true -> true
      expect(complexPredicate.test(5)).toBe(true);
    });

    it('should handle Predicate.from with combined predicates', () => {
      const isEven = Predicate.of((n: number) => n % 2 === 0);
      const isPositive = Predicate.of((n: number) => n > 0);
      const extractValue = (obj: { data: number }) => obj.data;

      // data is even AND data is positive
      const predicateForObject = Predicate.from(extractValue, isEven.and(isPositive));

      expect(predicateForObject.test({ data: 6 })).toBe(true);  // 6 is even and positive
      expect(predicateForObject.test({ data: -2 })).toBe(false); // -2 is even but not positive
      expect(predicateForObject.test({ data: 3 })).toBe(false);   // 3 is positive but not even
      expect(predicateForObject.test({ data: 0 })).toBe(false);   // 0 is even but not positive
      expect(predicateForObject.test({ data: -3 })).toBe(false);  // -3 is not even and not positive
    });

    it('should handle Predicate.from with .not()', () => {
      const isLongString = Predicate.of((s: string) => s.length > 5);
      const extractName = (obj: { user: { name: string } }) => obj.user.name;

      // user.name.length IS NOT > 5 (i.e., length <= 5)
      const hasShortNamePredicate = Predicate.from(extractName, isLongString.not());

      expect(hasShortNamePredicate.test({ user: { name: "abcdef" } })).toBe(false); // length 6, not(true) -> false
      expect(hasShortNamePredicate.test({ user: { name: "abc" } })).toBe(true);    // length 3, not(false) -> true
      expect(hasShortNamePredicate.test({ user: { name: "abcde" } })).toBe(true);  // length 5, not(false) -> true
    });

    it('should handle nested and/or operations with from', () => {
      const extractValue = (obj: { item: { category: string, price: number } }) => obj.item;

      const isElectronics = Predicate.from((item: { category: string, price: number }) => item.category, Predicate.of((cat: string) => cat === 'electronics'));
      const isCheap = Predicate.from((item: { category: string, price: number }) => item.price, Predicate.of((price: number) => price < 100));
      const isExpensive = Predicate.from((item: { category: string, price: number }) => item.price, Predicate.of((price: number) => price > 1000));

      // (isElectronics AND isCheap) OR isExpensive
      const complexObjectPredicate = Predicate.from(extractValue, isElectronics.and(isCheap).or(isExpensive));

      // Electronics, price 50: (true AND true) OR false -> true
      expect(complexObjectPredicate.test({ item: { category: 'electronics', price: 50 } })).toBe(true);
      // Electronics, price 200: (true AND false) OR false -> false
      expect(complexObjectPredicate.test({ item: { category: 'electronics', price: 200 } })).toBe(false);
      // Books, price 50: (false AND true) OR false -> false
      expect(complexObjectPredicate.test({ item: { category: 'books', price: 50 } })).toBe(false);
      // Books, price 1200: (false AND false) OR true -> true
      expect(complexObjectPredicate.test({ item: { category: 'books', price: 1200 } })).toBe(true);
      // Electronics, price 1200: (true AND false) OR true -> true
      expect(complexObjectPredicate.test({ item: { category: 'electronics', price: 1200 } })).toBe(true);
    });
  });
});

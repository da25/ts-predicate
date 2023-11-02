import {
  anyItem,
  atLeastItems,
  atMostItems,
  everyItem,
  hasDistinctItems,
  hasSize,
  includesItem,
  isEmptyArray,
  noneItem,
} from '../src/utils/array-utils.ts';
import {
  even,
  greaterThan,
  lessThan,
  withinBound,
} from '../src/utils/number-utils.ts';
import {
  equalTo,
  hasProperty,
  invokePropertyPredicate,
} from '../src/utils/object-utils.ts';
import { allOf, anyOf, not, then } from '../src/utils/predicate-util.ts';
import {
  Announcement,
  AnnouncementAttachment,
  AnnouncementContent,
  Something,
} from '../src/types.ts';
import { Predicate } from '../src/predicate.js';
import { isBlank } from '../src/utils/string-utils.js';

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
    expect(anyItem(greaterThan(6)).test(arr)).toBeTruthy();
    expect(noneItem(greaterThan(10)).test(arr)).toBeTruthy();
    expect(atLeastItems(greaterThan(6), 2).test(arr)).toBeTruthy();
    expect(atMostItems(lessThan(6), 3).test(arr)).toBeTruthy();
    expect(hasSize(equalTo(5)).test(arr)).toBeTruthy();
  });

  it('should work with complex predicates', () => {
    expect(
      allOf([everyItem(withinBound(0, 10)), anyItem(even())]).test(arr),
    ).toBeTruthy();
  });

  it('havingPropertyPredicate', () => {
    expect(
      invokePropertyPredicate<Something, 'isFinal'>('isFinal').test({
        name: 'g',
        get isReady() {
          return true;
        },
        value: 4,
        isEmpty: false,
        getValue: () => 4,
        double: (val: number) => val * 2,
        isFinal: () => true,
      }),
    ).toBeTruthy();
  });

  it('should test everyItem(withinBound))', () => {
    expect(everyItem(withinBound(0, 10)).test(arr)).toBeTruthy();
  });

  it('should test someItems(even())', () => {
    expect(anyItem(even())).toBeTruthy();
  });

  it('should test announcement', () => {
    const ancPred: Predicate<Announcement> = allOf([
      hasProperty('id', not(isBlank())),
      hasProperty(
        'contents',
        allOf([
          not(isEmptyArray()),
          Predicate.from<AnnouncementContent[], AnnouncementContent[]>(
            (contents) => contents.filter((content) => content.isDefault),
            hasSize(equalTo(1)).and(
              then<AnnouncementContent[], AnnouncementContent>(
                (defaultContents) => defaultContents[0],
                allOf([
                  hasProperty('title', not(isBlank())),
                  hasProperty('description', not(isBlank())),
                ]),
              ),
            ),
          ),
          Predicate.from<AnnouncementContent[], (string | undefined)[]>(
            (contents) => contents.map((content) => content.locale),
            allOf([hasDistinctItems(), noneItem(isBlank())]),
          ),
          everyItem(
            hasProperty(
              'attachments',
              isEmptyArray<AnnouncementAttachment>().or<
                AnnouncementAttachment[]
              >(
                noneItem(
                  anyOf([
                    hasProperty('id', isBlank()),
                    hasProperty('attachmentName', isBlank()),
                  ]),
                ),
              ),
            ),
          ),
        ]),
      ),
    ]);

    const anc: Announcement = {
      id: 'somedummyid',
      contents: [
        {
          isDefault: true,
          title: 'sometitle',
          description: 'somedesciption',
          locale: 'en',
          attachments: [],
        },
        {
          isDefault: false,
          locale: 'fr',
          attachments: [],
        },
      ],
    };

    expect(ancPred.test(anc)).toBeTruthy();
  });
});

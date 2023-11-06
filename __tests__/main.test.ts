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
  invokePropertyAsPredicate,
  record,
} from '../src/utils/object-utils.ts';
import {
  allOf,
  anyOf,
  asPredicate,
  not,
  then,
} from '../src/utils/predicate-util.ts';
import { Predicate } from '../src/predicate.ts';
import { isBlank } from '../src/utils/string-utils.ts';

interface Something {
  name: string;
  value: number;
  isReady: boolean;
  isEmpty: boolean;
  getValue: () => number;
  double: (val: number) => number;
  isFinal: () => boolean;
}

interface Record1 {
  name: string;
  value: number;
  isReady: boolean;
  innerRecord: Record2;
}

interface Record2 {
  order: number;
  isEmpty: boolean;
}

interface Announcement {
  id: string;
  modifiedByUserName?: string;
  senderOrgAnid?: string;
  senderOrgName?: string;
  receiverType?: 'ALL_RELATED' | 'ORG_ANID' | 'GROUP_ID' | 'REGION';
  senderType?: 'SYSTEM' | 'SUPPLIER' | 'BUYER';
  announcementStatus?: 'PUBLISHED' | 'FAILED' | 'PUBLISHING' | 'DRAFT';
  receivers?: string[];
  contents: AnnouncementContent[];
}

interface AnnouncementContent {
  id?: string;
  title?: string;
  description?: string;
  isDefault: boolean;
  locale?: string;
  attachments?: AnnouncementAttachment[];
}

interface AnnouncementAttachment {
  id?: string;
  attachmentBlobId?: string;
  attachmentName?: string;
  attachmentSize?: number;
}

describe('predicates', () => {
  let arr: number[];

  beforeEach(() => {
    arr = [2, 5, 9, 4, 7];
  });

  it('test array utils', () => {
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
      invokePropertyAsPredicate<Something, 'isFinal'>('isFinal').test({
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

  it('should test predicate records', () => {
    const pred: Predicate<Record1> = record<Record1>({
      name: not(isBlank()),
      value: greaterThan(5),
      isReady: asPredicate(),
      innerRecord: {
        order: withinBound(2, 7),
        isEmpty: asPredicate(),
      },
    });

    expect(
      pred.test({
        name: 'hello',
        value: 10,
        isReady: true,
        innerRecord: {
          order: 5,
          isEmpty: true,
        },
      }),
    ).toBeTruthy();
  });
});

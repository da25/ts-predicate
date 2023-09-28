import { Predicate } from './predicate.js';
import { Announcement, AnnouncementAttachment, AnnouncementContent } from './types.js';
import { allOf, anyOf, not, then } from './utils/predicate-util.js';
import { equalTo, hasProperty } from './utils/object-utils.js';
import { isBlank } from './utils/string-utils.js';
import {
  everyItem,
  hasDistinctItems,
  hasSize,
  isEmptyArray,
  noneItem,
} from './utils/array-utils.js';

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

console.log(ancPred.test(anc))

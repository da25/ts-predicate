import { Predicate } from '../predicate.js';
import { equalTo, isNull, isUndefined } from './object-utils.js';
import { anyOf } from './predicate-util.js';

export function isEmpty(): Predicate<string> {
  return equalTo<string>('');
}

export function isBlank(): Predicate<string> {
  return anyOf([isNull(), isUndefined(), isEmpty()]);
}

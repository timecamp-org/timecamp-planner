import { List, Map } from 'immutable';
import fuzzysearch from 'fuzzysearch';
import { Id } from '../../../utils/identifier';

const emptyList = List() as List<Id>;

/**
 * @param {Map} usersSearchNames
 * @param {string} text
 * @param {List<string>} excludedUserIds
 *
 * @return {List<string>}
 */
export function searchUserIdsByText(
  usersSearchNames: Map<Id, string>,
  text: string = '',
  excludedUserIds: List<Id> = emptyList
): List<Id> {
  let result = emptyList;
  const userIds = usersSearchNames.keySeq().toList();
  userIds.forEach((userId) => {
    const name = usersSearchNames.get(userId).toLowerCase();
    const textInLowerCase = text.toLowerCase();
    const matchFuzzy = fuzzysearch(textInLowerCase, name);

    if (name && matchFuzzy && excludedUserIds.indexOf(userId) === -1) {
      result = result.push(userId);
    }
  });

  const searchPhraseLowerCase = text.toLowerCase();

  result = result.sort((aId, bId) => {
    const aName = usersSearchNames.get(aId).toLowerCase();
    const bName = usersSearchNames.get(bId).toLowerCase();
    let positionA = aName.indexOf(searchPhraseLowerCase);
    let positionB = bName.indexOf(searchPhraseLowerCase);

    if (positionA < 0) {
      positionA = Number.MAX_SAFE_INTEGER;
    }
    if (positionB < 0) {
      positionB = Number.MAX_SAFE_INTEGER;
    }
    return positionA === positionB ? 0 : positionA < positionB ? -1 : 1;
  }) as List<Id>;

  return result;
}

import getUuidByString from 'uuid-by-string'
import '../globals'
import { Id } from './identifier';
import { List } from 'immutable';

export function generateConversationId(people: Id[] | List<Id>, organizationId: Id): Id {
  const usersArray = people.filter((value, index, array) => array.indexOf(value) === index).sort()
  const usersString = `${usersArray.join('')}::${organizationId}`

  return getUuidFromCombinedIdsString(usersString)
}

export function generateIntegrationId(userId: Id, organizationId: Id, extensionId: Id): string {
  return getUuidFromCombinedIdsString(`${userId}::${organizationId}::${extensionId}`)
}

export function getUuidFromCombinedIdsString(combinedIdsString: string): string {
  return getUuidByString(combinedIdsString).toLowerCase()
}

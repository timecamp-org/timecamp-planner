import { Id } from "../../../utils/identifier";
import { List, Map } from "immutable";
import { User } from 'models/domain/UsersModel/models'

export function sortUserIdsByNames(userIds: List<Id>, usersName: Map<Id, string>): List<Id> {
  return userIds.sort((userIdA, userIdB) => {
    const userNameA = usersName.get(userIdA) || ''
    const userNameB = usersName.get(userIdB) || ''
    return userNameA.toLowerCase() < userNameB.toLowerCase() ? -1 : 1
  }) as List<Id>
}

export function getUserNickname(user: User): string {
  if (!user) {
    return ''
  }

  if (user.nickname) {
    return user.nickname
  }

  if (user.email) {
    return user.email.split('@')[0]
  }

  return ''
}
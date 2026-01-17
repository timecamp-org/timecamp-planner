import { MessageHailType } from "../db/schema";

export function getIsOnlyOnlineUsersHail(hails: MessageHailType[]): boolean {
  return !!hails && hails.includes(MessageHailType.HERE) && hails.filter(hail => hail !== MessageHailType.HERE).length === 0
}

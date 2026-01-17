import { UserSessionDbRow, DeviceType } from "../db/schema";
import { Id } from "../common/identifier";


export interface UserSessionServiceInterface {
  /**
   * Creates a new session in sessions table.
   * By default takes start time from current timestamp.
   * Session id is generated if not provided
   *
   * @param {Id} userId
   * @param sessionId
   */
  startSession(userId: Id, sessionId?: Id): Promise<void>;

  updateSession(sessionId: Id, session: Partial<UserSessionDbRow>): Promise<void>;

  finishSession(sessionId: Id, wentOffline: boolean): Promise<void>;

  finishAllSessions(): Promise<void>;

  getUserSession(sessionId: Id): Promise<Partial<UserSessionDbRow>>

  /**
   * Returns number of times that user went offline.
   * This is not the same as finished session.
   *
   * @param {Id} userId
   * @return {Promise<number>}
   */
  getOfflineEventCount(userId: Id): Promise<number>;

  isOnline(userId: Id, trx?: Transaction): Promise<boolean>

  /**
   * Returns object keyed by user ids that contains boolean value with online status for
   * each provided user id.
   *
   * @param {Id[]} userIds
   * @return {Promise<{[p: string]: boolean}>}
   */
  getOnlineStatuses(userIds: Id[]): Promise<{ [_: string]: boolean }>

  getOnlineUserIds(deviceType?: DeviceType): Promise<Id[]>

  getUserIdsFirstOnlineBetweenDates(startDate: Date, endDate: Date): Promise<Id[]>

  filterUserIdsByNotLoggedInNDays(userIds: Id[], days: number): Promise<Id[]>
}

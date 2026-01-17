import { generateId, Id } from '../common/identifier'
import { LoggerInterface } from '../../../../infrastructure/logger'

import Table from '../db/Table'
import { DeviceType, UserOnlineDbRow, UserSessionDbRow } from '../db/schema'
import { reduce, without } from 'lodash'
import { inject, injectable } from 'inversify';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { CommonModule } from '../common/CommonModule';
import { UserSessionServiceInterface } from './UserSessionServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'


@injectable()
export class UserSessionService implements UserSessionServiceInterface {
  protected timeService: TimeServiceInterface;
  private logger: LoggerInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.logger = logger;
    this.timeService = timeService
  }

  async startSession(userId: Id, sessionId?: Id): Promise<void> {
    try {
      if (!sessionId) {
        sessionId = generateId();
        this.logger.verbose(`Auto-generating sessionId: ${sessionId}`);
      }
      const now = this.timeService.getCurrentTime();
      await this.connection.getQueryBuilder()
        .insert({
          id: sessionId,
          userId,
          startedAt: now
        })
        .into(Table.USER_SESSION)
      ;
      this.logger.debug(`Session [${sessionId}] for user [${userId}] started.`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async updateSession(sessionId: Id, session: Partial<UserSessionDbRow>): Promise<void> {
    try {
      await this.connection.getQueryBuilder()
        .update(session)
        .table(Table.USER_SESSION)
        .where('id', sessionId)
      ;
      this.logger.debug(`Session [${sessionId}] updated.`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async finishSession(sessionId: Id, wentOffline: boolean): Promise<void> {
    try {
      const now = this.timeService.getCurrentTime();
      await this.connection.getQueryBuilder()
        .update({
          finishedAt: now,
          wentOffline
        })
        .table(Table.USER_SESSION)
        .where('id', sessionId)
      ;
      this.logger.debug(`Session [${sessionId}] finished.`);
    } catch (e) {
      this.logger.error(e);
    }
  }


  async finishAllSessions(): Promise<void> {
    const now = this.timeService.getCurrentTime();
    await this.connection.getQueryBuilder()
      .table(Table.USER_SESSION)
      .update({
        finishedAt: now
      })
      .whereNull('finishedAt')
    ;
    this.logger.info('ALL sessions finished');
  }

  async getUserSession(id: Id): Promise<Partial<UserSessionDbRow>> {
    try {
      return await this.connection.getQueryBuilder()
        .select()
        .from(Table.USER_SESSION)
        .where('id', id)
        .first();
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async isOnline(userId: Id, trx?: Transaction): Promise<boolean> {
    const openedSession = await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.USER_SESSION)
      .where({ userId })
      .whereNull('finishedAt')
      .first();

    if (openedSession) {
      return true;
    }

    return false;
  }

  async getOfflineEventCount(userId: Id): Promise<number> {
    const res = await this.connection.getQueryBuilder()
      .count('* AS count')
      .from(Table.USER_SESSION)
      .where('user_id', userId)
      .andWhere('wentOffline', true)
      .first()
      ;

    return parseInt(res.count as string);
  }

  async getOnlineStatuses(userIds: Id[]): Promise<{ [_: string]: boolean }> {
    const userOpenedSessions: UserOnlineDbRow[] = await this.connection.getQueryBuilder()
      .from(Table.USER_ONLINE)
      .whereIn('userId', userIds)
      ;

    const result: { [_: string]: boolean } = reduce(userOpenedSessions, (onlineStatuses, session) => {
      if (userIds.includes(session.userId)) {
        onlineStatuses[session.userId] = true
      }
      return onlineStatuses
    }, {})

    return result
  }

  async getOnlineUserIds(deviceType?: DeviceType): Promise<Id[]> {
    let query = this.connection.getQueryBuilder()
      .select('userId')
      .distinct()
      .from(Table.USER_SESSION)
      .whereNull('finishedAt')
      ;

    if (deviceType) {
      query = query.andWhere({ deviceType })
    }
    const userOpenedSessions: UserOnlineDbRow[] = await query
    return userOpenedSessions.map(session => session.userId)
  }

  async getUserIdsFirstOnlineBetweenDates(startDate: Date, endDate: Date): Promise<Id[]> {
    const connection = this.connection.getConnection()
    const queryParams = {
      startDate: connection.raw('?', startDate),
      endDate: connection.raw('?', endDate)
    }

    const rawQueryRes = await connection
      .raw(`
        select user_id
        from (
          select user_id, MIN(started_at) as minStartDate
          from core.user_session
          group by user_id
          order by minStartDate, user_id
        ) as firstUserSession
        where firstUserSession.minStartDate between :startDate: and :endDate:;
      `, queryParams)

    return rawQueryRes.rows.map(({user_id}) => user_id)
  }

  async filterUserIdsByNotLoggedInNDays(userIds: Id[], days: number): Promise<Id[]> {
    const dateNDaysAgo = this.timeService.getDateNDaysAgo(days)
    const userIdsBeforeDate = await this.connection.getQueryBuilder()
      .distinct('userId')
      .from(Table.USER_SESSION)
      .whereIn('userId', userIds)
      .whereNotNull('finishedAt')
      .where('finishedAt', '<', dateNDaysAgo)
      .pluck('user_id')

    const userIdsStillOnlineOrAfterDate = await this.connection.getQueryBuilder()
      .distinct('userId')
      .from(Table.USER_SESSION)
      .whereIn('userId', userIdsBeforeDate)
      .andWhere(function() {
        this.where('finishedAt', '>', dateNDaysAgo)
        this.orWhereNull('finishedAt')
      })
      .pluck('user_id')

    const filteredUserIds = without(userIdsBeforeDate, ...userIdsStillOnlineOrAfterDate)

    return filteredUserIds
  }

}

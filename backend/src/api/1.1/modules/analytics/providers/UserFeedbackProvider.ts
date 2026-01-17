import UserFeedbackProviderInterface from '../interfaces/UserFeedbackProviderInterface'

import Table from '../../db/Table'
import { UserFeedbackDbRow } from '../../db/schema'
import { injectable } from 'inversify'
import { FeedbackJson, FeedbackType } from '../types'
import { Id } from '../../common/identifier'
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider'

@injectable()
export class UserFeedbackProvider
  extends AbstractPostgresProvider
  implements UserFeedbackProviderInterface 
{

  async setUserFeedback(userId: Id, feedbackType: FeedbackType, feedback: FeedbackJson): Promise<void> {
    const userFeedbackRow: Partial<UserFeedbackDbRow> = {
      userId,
      feedbackType,
      feedback,
    }
    await this.connection.getQueryBuilder()
      .insert(userFeedbackRow)
      .into(Table.USER_FEEDBACK)

    return
  }

  async getUserFeedbackByType(userId: Id, feedbackType: FeedbackType): Promise<UserFeedbackDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.USER_FEEDBACK)
      .select('*')
      .where({
        userId,
        feedbackType,
      })
  }

  async getLatestUserFeedbackByType(userId: Id, feedbackType: FeedbackType): Promise<UserFeedbackDbRow> {
    return await this.connection.getQueryBuilder()
      .from(Table.USER_FEEDBACK)
      .select('*')
      .where({
        userId,
        feedbackType,
      })
      .orderBy('createdAt', 'desc')
      .first()
  }

  async getFeedbackByType(feedbackType: FeedbackType): Promise<UserFeedbackDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.USER_FEEDBACK)
      .select('*')
      .where(feedbackType)
  }
}
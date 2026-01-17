import { AnalyticsServiceInterface } from './interfaces/AnalyticsServiceInterface'
import { inject, injectable } from 'inversify'
import { AnalyticsModule } from './AnalyticsModule'
import UserFeedbackProviderInterface from './interfaces/UserFeedbackProviderInterface'
import { FeedbackJson, FeedbackType, SetUserFeedbackStatus } from './types'
import { Id } from '../common/identifier'
import logger from '../../../../infrastructure/logger'
import { violatesForeignKey } from '../../../../utils'
import { ForeignKey } from '../db/Table'

@injectable()
export class AnalyticsService implements AnalyticsServiceInterface {
  protected userFeedbackProvider

  constructor(
    @inject(AnalyticsModule.UserFeedbackProviderInterface)
      userFeedbackProvider: UserFeedbackProviderInterface
  ) {
    this.userFeedbackProvider = userFeedbackProvider
  }

  async setUserFeedback(userId: Id, feedbackType: FeedbackType, feedback: FeedbackJson): Promise<SetUserFeedbackStatus> {
    try {
      await this.userFeedbackProvider.setUserFeedback(userId, feedbackType, feedback)
      return SetUserFeedbackStatus.OK
    } catch (error) {
      logger(error)
      if (violatesForeignKey(error, ForeignKey.USER_FEEDBACK_USER_FK)) {
        return SetUserFeedbackStatus.USER_NOT_FOUND
      } else {
        throw error
      }
    }
  }


}
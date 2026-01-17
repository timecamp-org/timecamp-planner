import { Id } from '../../common/identifier'
import { FeedbackJson, FeedbackType, SetUserFeedbackStatus } from '../types'

export interface AnalyticsServiceInterface {
  setUserFeedback(userId: Id, feedbackType: FeedbackType, feedback: FeedbackJson): Promise<SetUserFeedbackStatus>
}
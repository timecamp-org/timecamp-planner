import { Id } from '../../common/identifier'
import { UserFeedbackDbRow } from '../../db/schema'
import { FeedbackJson, FeedbackType } from '../types'

export default interface UserFeedbackProviderInterface {
  setUserFeedback(userId: Id, feedbackType: FeedbackType, feedback: FeedbackJson): Promise<void>
  getUserFeedbackByType(userId: Id, feedbackType: FeedbackType): Promise<UserFeedbackDbRow[]>
  getLatestUserFeedbackByType(userId: Id, feedbackType: FeedbackType): Promise<UserFeedbackDbRow>
  getFeedbackByType(feedbackType: FeedbackType): Promise<UserFeedbackDbRow[]>
}

import messageTextStyles from 'components/chat/MessageText/styles.css'
import messageReactionStyles from 'components/chat/MessageReactions/styles.css'
import dateLineStyles from 'components/date/DateLine/styles.css'
import fileMessageStyles from 'components/chat/FileMessage/styles.css'
import { messageImageMaxSize } from './MessageAttachment/component'
import { defaultMaxMessageTextHeight } from './MessageText/enhancers/EnhanceMessageText'
import activityStyles from './ActivityInChat/styles.css'
import messageStyles from 'components/chat/Message/styles.css'

export const defaultElementsHeight = {
  emptyContinuationMessageMinHeight: parseInt(messageStyles.emptyContinuationMessageMinHeight, 10),
  emptyFreshMessageMinHeight: parseInt(messageStyles.emptyFreshMessageMinHeight, 10),
  messageFileHeight: parseInt(fileMessageStyles.fileMessageMinHeight, 10),
  textLineHeight: parseInt(messageTextStyles.paragraphMinHeight, 10),
  reactionsHeight: parseInt(messageReactionStyles.messageReactionsMinHeightWithMargin, 10),
  dateSeparatorHeight: parseInt(dateLineStyles.dateLineMinHeight, 10),
  messageThumbnailMaxSize: parseInt(`${messageImageMaxSize}`, 10),
  maxTextHeight: parseInt(defaultMaxMessageTextHeight, 10),
  minActivityHeight: parseInt(activityStyles.activityMinHeightWithMargins, 10),
}
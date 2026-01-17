import { Id } from 'common/utils/identifier'
import { useSelector } from 'react-redux'
import {
  selectUserStatusTitle,
  selectUserStatusResetAt,
  selectUserStatusEmojiCode
} from 'models/domain/UserStatusModel/selectors/domain'

export type HoveredUserStatusTooltipHookInterface = {
  title: string,
  resetAt: number,
  emojiCode: string,
}

export default function useComponent(userId: Id): HoveredUserStatusTooltipHookInterface {
  return {
    title: useSelector(state => selectUserStatusTitle(state, { userId })),
    resetAt: useSelector(state => selectUserStatusResetAt(state, { userId })),
    emojiCode: useSelector(state => selectUserStatusEmojiCode(state, { userId })),
  }
}

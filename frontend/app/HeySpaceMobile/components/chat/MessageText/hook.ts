import { AnyDict } from '../../../../common/types'
import { MessageTextInterface } from './index'
import { selectMessageText } from 'models/domain/MessagesModel/selectors/domain'
import useMessageLinkDescriptors from '../../../hooks/useMessageLinkDescriptors'
import { LinkDescriptor } from 'common/utils/getLinkDescriptors'
import { useSelector } from 'common/hooks/useSelector'

export type MessageTextHookInterface = {
  text: string | number | AnyDict,
  isMarkdown: boolean,
  linkDescriptors: LinkDescriptor[],
}

export default function useComponent(props: MessageTextInterface): MessageTextHookInterface {
  // @ts-ignore
  const text = useSelector(state => selectMessageText(state, { messageId: props.messageId }) || props.text || '')
  const isMarkdown = typeof text === 'string'
  const linkDescriptors = useMessageLinkDescriptors(props.messageId, text)

  return {
    text,
    isMarkdown,
    linkDescriptors,
  }
}
import React, { useCallback, TouchEventHandler } from 'react'

import MarkdownOutput from '../../common/MarkdownOutput'
import QuillOutput from '../../common/QuillOutput'
import { AnyDict } from '../../../../common/types'
import { Id } from '../../../../common/utils/identifier'
import useComponent, { MessageTextHookInterface } from './hook'
import { LinkDescriptor } from 'common/utils/getLinkDescriptors'
import LinkPreview from '../LinkPreview'


export type MessageTextInterface = {
  messageId: Id,
  text?: string | number | AnyDict,
  shouldRenderLinkPreview?: boolean,
  onLongPressLink?: TouchEventHandler,
}

const defaultProps = {
  shouldRenderLinkPreview: true,
}

const MessageText: React.FC<MessageTextInterface> = (props) => {
  const hook = useComponent(props)
  
  const renderLinkPreview = useCallback((descriptor: LinkDescriptor) => {
    return (
      <LinkPreview
        key={`preview_${descriptor.url}`}
        linkTitle={descriptor.title}
        url={descriptor.url}
        messageId={props.messageId}
      />
    )
  }, [props.messageId])

  return (
    <>
      {renderOutput(props, hook)}
      {props.shouldRenderLinkPreview && hook.linkDescriptors.map(renderLinkPreview)}
    </>
  )
}

function renderOutput(
  props: MessageTextInterface,
  hook: MessageTextHookInterface
) {
  return hook.isMarkdown
    ? <MarkdownOutput text={hook.text} onLongPressLink={props.onLongPressLink} />
    : <QuillOutput text={hook.text} />
}

MessageText.defaultProps = defaultProps

export default MessageText 

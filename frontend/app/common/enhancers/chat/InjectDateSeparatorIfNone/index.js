import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'

import BaseComponent from '../../BaseComponent'
import { DATE_SEPARATOR } from '../../../models/domain/MessagesModel/constants/messageTypes'

function Enhance(ComposedComponent) {
  class InjectDateSeparatorIfNone extends BaseComponent {

    static propTypes = {
      chatItems: ImmutablePropTypes.list,
    }

    static defaultProps = {
      chatItems: new List(),
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          chatItems={this.getChatItems()}
        />
      )
    }

    getChatItems() {
      const firstChatItem = this.props.chatItems.first()
      const firstChatItemTimestamp = firstChatItem ? firstChatItem.get('timestamp') : null
      const firstChatItemType = firstChatItem ? firstChatItem.get('type') : null

      if (!firstChatItemTimestamp || firstChatItemType === DATE_SEPARATOR) {
        return this.props.chatItems
      }

      const newDateSeparator = new Map({
        id: `${DATE_SEPARATOR}::${firstChatItemTimestamp}`,
        timestamp: firstChatItemTimestamp,
        type: DATE_SEPARATOR,
      })

      return this.props.chatItems.unshift(newDateSeparator)
    }

  }

  return (InjectDateSeparatorIfNone)
}

export default (Enhance)

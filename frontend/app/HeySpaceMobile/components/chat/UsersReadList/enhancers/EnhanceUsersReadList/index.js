import React from 'react'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectProjectMessagesUsersRead } from 'models/domain/MessagesModel/selectors'
import { selectMessageContainerId } from 'models/domain/MessagesModel/selectors/domain'

function Enhance(ComposedComponent) {
  class EnhanceUsersReadList extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          userIdsRead={this.props.userIdsRead}
          maxIcons={this.props.maxIcons}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    const objectId = selectMessageContainerId(state, { messageId: props.messageId })
    const messagesUsersRead = selectProjectMessagesUsersRead(state, { objectId })
    return {
      userIdsRead: messagesUsersRead.get(props.messageId),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {

    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceUsersReadList)
}

export default Enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectMessageUser } from 'models/domain/MessagesModel/selectors/domain'

function enhance(ComposedComponent) {
  class EnhanceWithCanCurrentUserDeleteMessage extends BaseComponent {

    static propTypes = {
      currentUserId: PropTypes.string.isRequired,
      messageAuthorId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          canCurrentUserDeleteMessage={this.canCurrentUserDeleteMessage()}
        />
      )
    }

    canCurrentUserDeleteMessage() {
      return this.props.currentUserId === this.props.messageAuthorId
    }

  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    messageAuthorId: selectMessageUser(state, { messageId: props.messageId }),
  })

  return connect(mapStateToProps)(EnhanceWithCanCurrentUserDeleteMessage)
}

export default enhance

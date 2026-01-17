import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'
import { doNothing } from 'common/utils'

import { selectMessageFirstAttachmentId } from 'models/domain/MessagesModel/selectors'

import {
  selectMessageUser,
  selectMessageCreatedAt,
  selectMessageContainerId,
  selectMessageIsContinuation,
} from 'models/domain/MessagesModel/selectors/domain'

import { selectRequestIsFailure } from 'models/domain/RequestModel/selectors'
import { sendMessage } from 'models/domain/RequestModel/constants/requestTypes'

function Enhance(ComposedComponent) {
  class EnhanceMessage extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      id: PropTypes.string.isRequired,
      firstMessageAttachmentId: PropTypes.string,
      onMessageLongPress: PropTypes.func,
    }

    static defaultProps = {
      onMessageLongPress: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          id={this.props.id}
          text={this.props.text}
          userId={this.props.userId}
          dateAdded={this.props.dateAdded}
          firstMessageAttachmentId={this.props.firstMessageAttachmentId}
          hasMessageError={this.props.hasMessageError}
          isContinuation={this.props.isContinuation}

          onSetRef={this.onSetRef}
          onLongPress={this.onLongPress}
        />
      )
    }

    onSetRef(ref) {
      this.props.onSetRef(ref, this.props.id)
    }

    onLongPress() {
      this.props.onMessageLongPress(this.props.id)
    }

  }

  function mapStateToProps(state, props) {
    const objectId = selectMessageContainerId(state, { messageId: props.id })
    return {
      dateAdded: selectMessageCreatedAt(state, { messageId: props.id }),
      hasMessageError: selectRequestIsFailure(state, { objectId: props.id, requestType: sendMessage }),
      userId: selectMessageUser(state, { messageId: props.id }),
      isContinuation: selectMessageIsContinuation(state, { messageId: props.id, objectId }),
      firstMessageAttachmentId: selectMessageFirstAttachmentId(state, { messageId: props.id }),
    }
  }

  return connect(mapStateToProps)(EnhanceMessage)
}

export default Enhance

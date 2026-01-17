import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Clipboard } from 'react-native'

import BaseComponent from 'BaseComponent'
import { selectMessageText } from 'models/domain/MessagesModel/selectors/domain'
import { selectUsersNicknames } from 'models/domain/UsersModel/selectors/domain'
import { parseMarkdownToText } from '../../../../../utils/markdownUtils'

function enhance(ComposedComponent) {
  class EnhanceWithCopyMessageAction extends BaseComponent {

    static propTypes = {
      messageId: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onCopyMessage={this.onCopyMessage}
        />
      )
    }

    onCopyMessage() {
      const { messageText, usersNicknames } = this.props
      const text = parseMarkdownToText(messageText, usersNicknames)

      Clipboard.setString(text)
      this.props.onClose()
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      messageText: selectMessageText(state, { messageId: props.messageId }),
      usersNicknames: selectUsersNicknames(state),
    }
  }

  return connect(mapStateToProps)(EnhanceWithCopyMessageAction)
}

export default enhance

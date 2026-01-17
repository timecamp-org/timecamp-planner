import React from 'react'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectUsersNicknames } from 'models/domain/UsersModel/selectors/domain'
import MarkdownRenderer from 'models/domain/MessagesModel/MarkdownRenderer'
import getBoundMarkdownToReactRenderers from '../../markdownToReactRenderers'

function Enhance(ComposedComponent) {
  class EnhanceMarkdownOutput extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
      super(props)

      this.state = {
        isMessageTextTooLong: false,
        isTextFolded: true,
      }

      this.rules = new MarkdownRenderer({
        userNicknamesByIds: props.userNicknamesByIds,
        getBoundRenderers: getBoundMarkdownToReactRenderers({
          shouldRenderLinkPreview: true,
          shouldRenderMention: true,
          shouldRenderHail: true,
          onLongPressLink: props.onLongPressLink,
        }),
        shouldUseDefaultRules: false,
      }).getRules()
    }

    render() {
      return (
        <ComposedComponent
          rules={this.rules}
          text={this.props.text}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      userNicknamesByIds: selectUsersNicknames(state),
    }
  }

  return connect(mapStateToProps)(EnhanceMarkdownOutput)
}

export default Enhance

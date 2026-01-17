import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import * as MessagesModelActions from 'models/domain/MessagesModel/actions'

import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceMessageReaction extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      className: PropTypes.string,
      messageId: PropTypes.string.isRequired,
      emojiCode: PropTypes.string.isRequired,
      size: PropTypes.number,
      userIds: ImmutablePropTypes.list,
      onClick: PropTypes.func,
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          emojiCode={this.props.emojiCode}
          size={this.props.size}
          userIds={this.props.userIds}

          onClick={this.onClick}
        />
      )
    }

    onClick() {
      this.props.onAddReaction()
    }

  }

  const mapDispatchToProps = (dispatch, props) => ({
    onAddReaction: () => dispatch(MessagesModelActions.onMessageReactionAdd(props.messageId, props.emojiCode)),
  })

  return connect(null, mapDispatchToProps)(EnhanceMessageReaction)
}

export default (Enhance)

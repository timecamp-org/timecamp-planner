import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import { selectSortedMessageReactionIds, selectMessageReactions } from 'models/domain/MessagesModel/selectors/domain'

import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceMessageReactions extends BaseComponent {

    static propTypes = {
      messageId: PropTypes.string.isRequired,

      // this enhancer
      messageReactions: ImmutablePropTypes.map.isRequired,
    }

    static defaultProps = {
      messageReactions: new Map(),
    }

    state = {
      isReactionPickerOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          messageId={this.props.messageId}
          messageReactions={this.props.messageReactions}
          sortedReactionIds={this.props.sortedReactionIds}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      sortedReactionIds: selectSortedMessageReactionIds(state, { messageId: props.messageId }),
      messageReactions: selectMessageReactions(state, { messageId: props.messageId }),
    }
  }

  return connect(mapStateToProps)(EnhanceMessageReactions)
}

export default (Enhance)

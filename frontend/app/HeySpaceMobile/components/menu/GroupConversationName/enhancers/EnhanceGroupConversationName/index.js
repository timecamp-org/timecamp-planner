import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectConversationName } from 'models/domain/ProjectsModel/selectors'

function enhance(ComposedComponent) {
  class EnhanceGroupConversationName extends BaseComponent {

    static propTypes = {
      conversationId: PropTypes.string.isRequired,
      conversationName: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          style={this.props.style}
          numberOfLines={this.props.numberOfLines}
          ellipsizeMode={this.props.ellipsizeMode}

          conversationName={this.props.conversationName}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      conversationName: selectConversationName(state, { conversationId: props.conversationId }),
    }
  }


  return connect(mapStateToProps)(EnhanceGroupConversationName)
}

export default enhance

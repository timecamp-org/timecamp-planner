import React from 'react'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'

import { selectProjectIsGroupOrDirectChat } from 'models/domain/ProjectsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceMentionText extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isProjectGroupOrDirectChat={this.props.isProjectGroupOrDirectChat}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    let isProjectGroupOrDirectChat = null

    if (props.projectId) {
      isProjectGroupOrDirectChat = selectProjectIsGroupOrDirectChat(state, { projectId: props.projectId })
    }
    return {
      isProjectGroupOrDirectChat,
    }
  }

  return connect(mapStateToProps)(EnhanceMentionText)
}

export default Enhance

import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import { selectMessageContainerId } from 'models/domain/MessagesModel/selectors/domain'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'

import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceReaction extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      className: PropTypes.string,
      messageId: PropTypes.string,
      emojiCode: PropTypes.string.isRequired,
      taskId: PropTypes.string,
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
          projectColor={this.props.projectColor}
          isCurrentUserReacted={this.isCurrentUserReacted()}

          onClick={this.props.onClick}
        />
      )
    }

    isCurrentUserReacted() {
      return this.props.userIds.includes(this.props.currentUserId)
    }

  }

  const mapStateToProps = (state, props) => {
    let containerId
    if (props.taskId) {
      containerId = selectProjectIdByTaskId(state, { taskId: props.taskId })
    } else {
      containerId = selectMessageContainerId(state, { messageId: props.messageId })
    }

    return {
      projectColor: selectProjectColor(state, { projectId: containerId }),
      currentUserId: selectCurrentUserId(state),
    }
  }

  return connect(mapStateToProps, null)(EnhanceReaction)
}

export default (Enhance)

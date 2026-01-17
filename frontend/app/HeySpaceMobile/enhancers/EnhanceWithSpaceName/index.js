import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'

import { selectProjectName } from 'models/domain/ProjectsModel/selectors'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import { selectProjectIdByListId } from 'models/domain/ListsModel/selectors'

function enhance(ComposedComponent) {
  class EnhanceWithSpaceName extends BaseComponent {

    static propTypes = {
      spaceId: PropTypes.string,
      projectId: PropTypes.string,
      taskId: PropTypes.string,
      listId: PropTypes.string,
      spaceName: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          spaceId={this.props.spaceId}
          spaceName={this.props.spaceName}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    let projectId = props.spaceId || props.projectId
    if (!projectId && props.taskId) {
      projectId = selectProjectIdByTaskId(state, { taskId: props.taskId })
    }

    if (!projectId && props.listId) {
      projectId = selectProjectIdByListId(state, { listId: props.listId })
    }

    return {
      spaceName: selectProjectName(state, { projectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceWithSpaceName)
}

export default enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectTaskDescription } from 'models/domain/TasksModel/selectors'
import { selectIsTaskDescriptionDirty } from 'models/domain/TasksModel/selectors/domain'
import * as TasksActions from 'models/domain/TasksModel/actions'
import RouteName from '../../../../AppNavigation/routeNames'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceCardDescription extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,

      // injects
      description: PropTypes.string.isRequired,
      isDirty: PropTypes.bool.isRequired,
      onTaskUpdate: PropTypes.func.isRequired,
      onSetIsTaskDescriptionDirty: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          description={this.props.description}
          onDescriptionPress={this.onDescriptionPress}
        />
      )
    }

    onDescriptionPress() {
      NavigationService.navigate(RouteName.CARD_DESCRIPTION, { taskId: this.props.taskId })
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      description: selectTaskDescription(state, { taskId: props.taskId }),
      isDirty: selectIsTaskDescriptionDirty(state),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onTaskUpdate: (taskId, taskFields) => dispatch(TasksActions.onTaskUpdate(taskId, taskFields, true)),
    onSetIsTaskDescriptionDirty: (isDirty) => dispatch(TasksActions.onSetIsTaskDescriptionDirty(isDirty)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDescription)
}

export default enhance

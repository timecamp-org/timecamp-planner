import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskColor, selectTaskProgressEstimate } from 'models/domain/TasksModel/selectors'
import * as TasksModelActions from '../../../../../../common/models/domain/TasksModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceCardDetailsProgress extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
      onChangeProgressEstimate: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          taskColor={this.props.taskColor}
          taskProgress={this.props.taskProgress}

          onTaskProgressChange={this.onChangeProgressEstimate}
        />
      )
    }

    onChangeProgressEstimate(taskProgress) {
      this.props.onChangeProgressEstimate(taskProgress)
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
      taskProgress: selectTaskProgressEstimate(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onChangeProgressEstimate: (progressEstimate) => dispatch(TasksModelActions.onChangeProgressEstimate(props.taskId, progressEstimate, true)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetailsProgress)
}

export default Enhance

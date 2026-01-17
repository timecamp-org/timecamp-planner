import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskDueDate } from 'models/domain/TasksModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceTaskDueDate extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          taskDueDate={this.props.taskDueDate}
          styles={this.props.styles}
          alwaysVisible={this.props.alwaysVisible}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskDueDate: selectTaskDueDate(state, { taskId: props.taskId }),
    }
  }

  return connect(mapStateToProps)(EnhanceTaskDueDate)
}

export default Enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskProgressEstimate } from 'models/domain/TasksModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceTaskProgress extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          taskProgress={this.props.taskProgress}
          styles={this.props.styles}
          alwaysVisible={this.props.alwaysVisible}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskProgress: selectTaskProgressEstimate(state, { taskId: props.taskId }),
    }
  }

  return connect(mapStateToProps)(EnhanceTaskProgress)
}

export default Enhance

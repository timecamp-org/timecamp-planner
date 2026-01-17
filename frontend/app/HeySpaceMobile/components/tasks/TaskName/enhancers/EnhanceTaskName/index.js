import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'


import { selectTaskName } from 'models/domain/TasksModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceTaskName extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          taskName={this.props.taskName}
          styles={this.props.styles}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskName: selectTaskName(state, { taskId: props.taskId }),
    }
  }

  return connect(mapStateToProps)(EnhanceTaskName)
}

export default Enhance

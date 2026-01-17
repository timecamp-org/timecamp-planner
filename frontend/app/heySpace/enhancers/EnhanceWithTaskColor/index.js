import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


import { selectTaskColor } from 'models/domain/TasksModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceWithTaskColor extends React.Component { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,

      // injects
      color: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          color={this.props.color}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: selectTaskColor(state, { taskId: props.taskId }),
    }
  }

  return connect(mapStateToProps)(EnhanceWithTaskColor)
}

export default Enhance

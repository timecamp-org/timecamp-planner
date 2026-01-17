import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskDescription, selectTaskColor } from 'models/domain/TasksModel/selectors'
import { onTaskUpdate } from 'models/domain/TasksModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceTaskDescriptionIO extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    state = {
      value: this.props.taskDescription,
      isBeingEdited: false,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isBeingEdited={this.state.isBeingEdited}
          value={this.state.value}

          taskDescription={this.props.taskDescription}
          taskColor={this.props.taskColor}

          onChangeText={this.onChangeText}
          onClick={this.onClick}
          onBlur={this.onBlur}
        />
      )
    }

    onClick() {
      this.setState({
        isBeingEdited: true,
        value: this.props.taskDescription,
      })
    }

    onBlur() {
      this.props.onTaskDescriptionChange(this.state.value)

      this.setState({
        isBeingEdited: false,
      })
    }

    onChangeText(value) {
      this.setState({
        value,
      })
    }

    componentWillUnmount() {
      if (this.state.value !== this.props.taskDescription) {
        this.props.onTaskDescriptionChange(this.state.value)
      }
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskDescription: selectTaskDescription(state, { taskId: props.taskId }),
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onTaskDescriptionChange: (name) => dispatch(onTaskUpdate(props.taskId, { name })),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskDescriptionIO)
}

export default Enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskName, selectTaskColor } from 'models/domain/TasksModel/selectors'
import { onTaskUpdate } from 'models/domain/TasksModel/actions'
import { Keyboard } from 'react-native'

function Enhance(ComposedComponent) {
  class EnhanceTaskNameIO extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    state = {
      value: this.props.taskName,
      isBeingEdited: false,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isBeingEdited={this.state.isBeingEdited}
          value={this.state.value}

          taskName={this.props.taskName}
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
        value: this.props.taskName,
      })
    }

    onBlur() {
      this.props.onTaskNameChange(this.state.value)
      Keyboard.dismiss()

      this.setState({
        isBeingEdited: false,
      })
    }

    onChangeText(value) {
      this.setState({
        value,
      })
    }

    componentDidUpdate(prevProps) {
      if (prevProps.taskId !== this.props.taskId) {
        this.setState({
          isBeingEdited: false,
          value: this.props.taskName,
        })
      }
    }

    componentWillUnmount() {
      if (this.state.value !== this.props.taskName) {
        this.props.onTaskNameChange(this.state.value)
      }
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskName: selectTaskName(state, { taskId: props.taskId }),
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onTaskNameChange: (name) => dispatch(onTaskUpdate(props.taskId, { name })),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskNameIO)
}

export default Enhance

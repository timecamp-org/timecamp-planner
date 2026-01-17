import React from 'react'
import { DatePickerAndroid } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getTime from 'date-fns/get_time'

import { onChangeDueDate } from 'models/domain/TasksModel/actions'
import BaseComponent from 'BaseComponent'

import { selectTaskDueDate, selectTaskColor } from 'models/domain/TasksModel/selectors'
import isIOS from '../../../../../utils/isIOS'

function Enhance(ComposedComponent) {
  class EnhanceCardDetailsDueDate extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    state = {
      isIOSDatePickerOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          taskDueDate={this.props.taskDueDate}
          taskColor={this.props.taskColor}
          isIOSDatePickerOpen={this.state.isIOSDatePickerOpen}

          styles={this.props.styles}

          onOpenDatePicker={isIOS ? this.onOpenIOSDatePicker : this.onOpenAndroidDatePicker}
          onCloseIOSDatePicker={this.onCloseIOSDatePicker}
          onChangeDueDate={this.onChangeDueDate}
        />
      )
    }

    onChangeDueDate(dueDate) {
      const timestamp = getTime(dueDate)
      this.props.onChangeDueDate(timestamp)
    }

    onOpenIOSDatePicker() {
      this.setState({
        isIOSDatePickerOpen: true,
      })
    }

    onCloseIOSDatePicker() {
      this.setState({
        isIOSDatePickerOpen: false,
      })
    }

    async onOpenAndroidDatePicker() {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: new Date(),
        })
  
        if (action !== DatePickerAndroid.dismissedAction) {
          const date = new Date(year, month, day)
          const timestamp = getTime(date)
          this.props.onChangeDueDate(timestamp)
        }
      } catch(error) {
        // TODO: alert
      }
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskDueDate: selectTaskDueDate(state, { taskId: props.taskId }),
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onChangeDueDate: (timestamp) => dispatch(onChangeDueDate(props.taskId, timestamp)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetailsDueDate)
}

export default Enhance

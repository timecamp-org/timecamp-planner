import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, DatePickerIOS, View } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'
import { doNothing } from 'common/utils'

import Calendar from 'Icons/Calendar'
import TaskDueDate from '../../tasks/TaskDueDate'
import styles from './styles'
import isIOS from '../../../utils/isIOS'
import { dateNow } from '../../../../common/utils/date'

CardDetailsDueDate.propTypes = {
  taskDueDate: PropTypes.number,
  isIOSDatePickerOpen: PropTypes.bool,
  onOpenDatePicker: PropTypes.func,
  onCloseIOSDatePicker: PropTypes.func,
  onChangeDueDate: PropTypes.func,
}

CardDetailsDueDate.defaultProps = {
  isIOSDatePickerOpen: false,
  onOpenDatePicker: doNothing,
  onCloseIOSDatePicker: doNothing,
}

export default function CardDetailsDueDate(props) {
  return (
    <>
      <TouchableOpacity
        style={styles.component}
        onPress={props.onOpenDatePicker}
      >
        <Calendar
          style={styles.calendarIcon}
          color={props.taskColor}
        />
        <TaskDueDate taskId={props.taskId} styles={styles.taskDueDate} />
      </TouchableOpacity>
      {isIOS
        ? <UniversalModal
          isVisible={props.isIOSDatePickerOpen}
          onBackdropPress={props.onCloseIOSDatePicker}
        >
          <View style={styles.modalContent}>
            <DatePickerIOS
              date={props.taskDueDate ? new Date(props.taskDueDate) : dateNow()}
              mode={'date'}
              onDateChange={props.onChangeDueDate}
            />
          </View>
        </UniversalModal>
        : null
      }
    </>
  )
}

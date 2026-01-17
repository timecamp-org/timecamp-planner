import React from 'react'
import PropTypes from 'prop-types'
import { Text, TextInput, TouchableOpacity } from 'react-native'

import styles from './styles'

TaskDescriptionIO.propTypes = {
  taskDescription: PropTypes.string.isRequired,
}

TaskDescriptionIO.defaultProps = {
  taskDescription: '',
}

export default function TaskDescriptionIO(props) {
  if (props.isBeingEdited) {
    return (
      <TextInput
        style={{ 
          ...styles.taskInput,
          ...props.taskInputStyles
        }}
        value={props.value}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        underlineColorAndroid={props.taskColor}
        multiline = {true}
        autoFocus
      />
    )
  } else {
    return (
      <TouchableOpacity
        style={{
          ...styles.taskDescriptionWrapper,
          ...props.taskDescriptionWrapperStyles,
        }}
        onPress={props.onClick}
      >
        <Text
          style={{
            ...styles.taskDescription,
            ...props.taskDescriptionTextStyles,
            color: props.taskColor,
          }}
        >
          {props.taskDescription}
        </Text>
      </TouchableOpacity>
    )
  }
}

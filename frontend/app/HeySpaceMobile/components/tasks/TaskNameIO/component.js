import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { ellipsizeInTheEnd } from 'common/utils';
import styles from './styles';

TaskNameIO.propTypes = {
  taskName: PropTypes.string.isRequired,
};

TaskNameIO.defaultProps = {
  taskName: '',
};

export default function TaskNameIO(props) {
  if (props.isBeingEdited) {
    return (
      <TextInput
        style={{
          ...styles.taskInput,
          ...props.taskInputStyles,
        }}
        value={props.value}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        underlineColorAndroid={props.taskColor}
        onSubmitEditing={props.onBlur}
        multiline={true}
        autoFocus
        placeholder={'Add task name'}
      />
    );
  } else {
    return (
      <TouchableOpacity
        style={{
          ...styles.taskNameWrapper,
          ...props.taskNameWrapperStyles,
        }}
        onPress={props.onClick}
      >
        <Text
          style={{
            ...styles.taskName,
            ...props.taskNameTextStyles,
            color: props.taskColor,
          }}
        >
          {ellipsizeInTheEnd(props.taskName, 40)}
        </Text>
      </TouchableOpacity>
    );
  }
}

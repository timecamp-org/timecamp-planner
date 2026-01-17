import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TextInput } from 'react-native';

import HumanMessage from 'components/common/HumanMessage';

import styles from './styles';
import { slate60Color } from 'common/commonStyles/colors';

Input.propTypes = {
  shouldRenderHeaders: PropTypes.bool,
  placeholder: PropTypes.string,
  textContentType: PropTypes.string,
  keyboardType: PropTypes.string,
  innerRef: PropTypes.func,
  onSubmitEditing: PropTypes.func,
};

Input.defaultProps = {
  shouldRenderHeaders: true,
  placeholder: '',
  textContentType: 'none',
};

export default function Input(props) {
  const validationStyle =
    props.validation && !props.validation.isValid
      ? styles.invalidInputStyle
      : {};
  return (
    <View style={styles.container}>
      {props.shouldRenderHeaders ? (
        <View style={styles.headers}>
          <Text style={styles.primaryHeaderText}>
            {props.primaryHeaderText}
          </Text>
          <Text
            style={styles.secondaryHeaderText}
            onPress={props.onSecondaryHeaderClick}
          >
            {props.secondaryHeaderText}
          </Text>
        </View>
      ) : null}
      <View style={styles.input}>
        <TextInput
          ref={props.innerRef}
          style={{
            ...styles.textInput,
            ...validationStyle,
          }}
          placeholder={props.placeholder}
          placeholderTextColor={slate60Color}
          textContentType={props.textContentType}
          keyboardType={props.keyboardType}
          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          onBlur={props.onBlur}
          onSubmitEditing={props.onSubmitEditing}
        />
        {props.validation && !props.validation.isValid
          ? renderValidationMessage()
          : null}
        {props.humanMessage ? renderHumanMessage() : null}
      </View>
    </View>
  );

  function renderValidationMessage() {
    return (
      <Text style={styles.validationMessage}>{props.validation.message}</Text>
    );
  }

  function renderHumanMessage() {
    return <HumanMessage humanMessage={props.humanMessage} />;
  }
}

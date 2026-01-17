import React from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { doNothing } from 'common/utils'
import { List } from 'immutable'

import Send from '../../Icons/Send'
import MentionPicker from '../MentionPicker'
import { slate60Color } from 'common/commonStyles/colors'
import { wisteriaColor } from 'common/commonStyles/colors'

const emptyList = new List()

NewMessageInput.propTypes = {
  objectId: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isMentionPickerVisible: PropTypes.bool,
  mentionSearchValue: PropTypes.string,
  color: PropTypes.string,
  textElements: ImmutablePropTypes.list,

  onSetInputRef: PropTypes.func.isRequired,
  onMentionUser: PropTypes.func.isRequired,
  onHail: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onChange: PropTypes.func,
  onTextInput: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onSendMessage: PropTypes.func,
  onFocusInput: PropTypes.func,
}

NewMessageInput.defaultProps = {
  placeholder: 'Message',
  isMentionPickerVisible: false,
  mentionSearchValue: '',
  color: wisteriaColor,
  textElements: emptyList,

  onKeyPress: doNothing,
  onChange: doNothing,
  onTextInput: doNothing,
  onSelectionChange: doNothing,
  onSendMessage: doNothing,
  onFocusInput: doNothing,
}

export default function NewMessageInput(props) {
  return (
    <>
      <View
        style={styles.container}
        onPress={props.onFocusInput}
      >
        {renderInput()}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={props.onSendMessage}
        >
          <Send />
        </TouchableOpacity>
      </View>
      <MentionPicker
        objectId={props.objectId}
        isVisible={props.isMentionPickerVisible}
        searchValue={props.mentionSearchValue}
        onMentionUser={props.onMentionUser}
        onHail={props.onHail}
      />
    </>
  )

  function renderInput() {
    return (
      <TextInput
        ref={props.onSetInputRef}
        editable={true}
        style={styles.input}
        placeholder={props.placeholder}
        placeholderTextColor={slate60Color}
        multiline={true}
        onKeyPress={props.onKeyPress}
        onChange={props.onChange}
        onTextInput={props.onTextInput}
        onSelectionChange={props.onSelectionChange}
      >
        {props.textElements.map(renderTextElement)}
      </TextInput>
    )
  }

  function renderTextElement(element, key) {
    let style = styles.textElement

    if (element.isMention || element.isHail) {
      style = { ...styles.mention, color: props.color }
    }

    return (
      <Text key={key} style={style}>
        {element.text}
      </Text>
    )
  }
}

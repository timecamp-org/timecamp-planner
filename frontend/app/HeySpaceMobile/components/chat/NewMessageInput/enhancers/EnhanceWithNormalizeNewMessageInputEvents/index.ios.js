import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceWithNormalizeNewMessageInputEvents extends BaseComponent {

    static propTypes = {
      onSetStateAfterInputChange: PropTypes.func.isRequired,
    }

    lastPressedKey = null
    lastInputText = ''
    lastInputSelectionState = { start: 0, end: 0 }


    render() {
      return (
        <ComposedComponent
          placeholder={this.props.placeholder}
          textElements={this.props.textElements}
          objectId={this.props.objectId}
          color={this.props.color}

          mentionPosition={this.props.mentionPosition}
          mentionSearchValue={this.props.mentionSearchValue}
          isMentionPickerVisible={this.props.isMentionPickerVisible}

          onSetInputRef={this.onSetInputRef}
          onChange={this.onChange}
          onSelectionChange={this.onSelectionChange}
          onKeyPress={this.onKeyPress}
          onFocusInput={this.onFocusInput}
          onSendMessage={this.onSendMessage}
          onMentionUser={this.onMentionUser}
          onHail={this.onHail}
        />
      )
    }

    onSetInputRef(ref) {
      this.inputRef = ref
    }

    onMentionUser(userId) {
      const textWithMention = this.props.onMentionUser(userId)
      this.lastInputText = textWithMention
    }

    onHail(hail) {
      const textWithMention = this.props.onHail(hail)
      this.lastInputText = textWithMention
    }

    onKeyPress({ nativeEvent }) {
      this.lastPressedKey = nativeEvent.key
    }

    onChange({ nativeEvent }) {
      this.lastInputText = nativeEvent.text
    }

    onSendMessage() {
      this.lastInputText = ''
      this.lastPressedKey = null
      this.lastInputSelectionState = { start: 0, end: 0 }
      this.props.onSendMessage()
    }

    onSelectionChange({ nativeEvent }) {
      setTimeout(() => {
        this.lastInputSelectionState = nativeEvent.selection
        this.props.onSetStateAfterInputChange(this.lastPressedKey, nativeEvent.selection, this.lastInputText)
      }, 100)
    }

    onFocusInput() {
      if (this.inputRef) {
        this.inputRef.focus()
      }
    }

  }

  return EnhanceWithNormalizeNewMessageInputEvents
}

export default Enhance

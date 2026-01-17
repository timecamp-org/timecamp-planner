import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import diff from 'fast-diff'

function Enhance(ComposedComponent) {
  class EnhanceWithNormalizeNewMessageInputEvents extends BaseComponent {

    static propTypes = {
      onSetStateAfterInputChange: PropTypes.func.isRequired,
    }

    oldText = ''
    newText = ''

    render() {
      return (
        <ComposedComponent
          textElements={this.props.textElements}
          placeholder={this.props.placeholder}
          objectId={this.props.objectId}
          color={this.props.color}

          mentionPosition={this.props.mentionPosition}
          mentionSearchValue={this.props.mentionSearchValue}
          isMentionPickerVisible={this.props.isMentionPickerVisible}

          onSetInputRef={this.onSetInputRef}
          onSendMessage={this.onSendMessage}
          onMentionUser={this.onMentionUser}
          onHail={this.onHail}
          onChange={this.onChange}
          onSelectionChange={this.onSelectionChange}
        />
      )
    }

    onSetInputRef(ref) {
      this.inputRef = ref
    }

    onMentionUser(userId) {
      const textWithMention = this.props.onMentionUser(userId)
      this.newText = textWithMention
    }

    onHail(hail) {
      const textWithMention = this.props.onHail(hail)
      this.newText = textWithMention
    }

    onSendMessage() {
      this.oldText = ''
      this.newText = ''
      this.props.onSendMessage()
    }
    
    onChange({ nativeEvent }) {
      this.oldText = this.newText || ''
      this.newText = nativeEvent.text || ''
    }

    onSelectionChange({ nativeEvent }) {
      const { selection } = nativeEvent
      const inputTextDiff = diff(this.oldText, this.newText)
      const wasBackspacePressed = inputTextDiff.findIndex(operation => operation[0] === -1) >= 0
      const pressedKeyOperation = inputTextDiff.find(operation => operation[0] === 1)
      const pressedKey = pressedKeyOperation
        ? pressedKeyOperation[1]
        : ''

      const key = wasBackspacePressed
        ? 'Backspace'
        : pressedKey

      this.props.onSetStateAfterInputChange(key, selection, this.newText)
    }

  }

  return EnhanceWithNormalizeNewMessageInputEvents
}

export default Enhance

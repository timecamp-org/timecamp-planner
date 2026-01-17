
export const getCurrentMentionPosition = (text, mentionStartPosition) => {
  const prefix = text.slice(0, mentionStartPosition)
  const mention = text.slice(mentionStartPosition)
  const end = mention.indexOf(' ') >= 0 ? mention.indexOf(' ') : mention.length

  return { start: mentionStartPosition, end: prefix.length + end }
}

export const getCurrentMention = (text, mentionStartPosition) => {
  const { start, end } = getCurrentMentionPosition(text, mentionStartPosition)

  return text.slice(start, end)
}

export const onHideMentionPicker = () => {
  return {
    isMentionPickerVisible: false,
    mentionStartPosition: -1,
    mentionSearchValue: '',
  }
}

export const onShowMentionPicker = (start) => {
  return {
    isMentionPickerVisible: true,
    mentionStartPosition: start - 1,
    mentionSearchValue: '',
  }
}

export const calculateStateAfterKeyPress = (key, text, selection, prevState) => {
  const { start, end } = selection
  const prevChar = text.charAt(start - 2)
  const { isMentionPickerVisible, mentionSearchValue, mentionStartPosition } = prevState
  let nextState = {}

  if (key && key !== 'Backspace') {
    if (key === ' ' && isMentionPickerVisible) {
      nextState = onHideMentionPicker()
    } else if (key === '@' && (prevChar === ' ' || text.length === 1)) {
      nextState = onShowMentionPicker(start)
    }

    if (prevState.isMentionPickerVisible && key !== '@' && start >= mentionStartPosition) {
      nextState.mentionSearchValue = `${mentionSearchValue}${key}`
    } else if (start < mentionStartPosition) {
      nextState.mentionStartPosition += 1
    }
  } else if (key && key === 'Backspace') {
    const mentionPosition = getCurrentMentionPosition(text, mentionStartPosition)

    if (mentionPosition.start <= start || mentionPosition.end >= end) {
      const mention = getCurrentMention(text, mentionStartPosition)

      if (mention.indexOf('@') === -1) {
        nextState = { ...nextState, ...onHideMentionPicker() }
      } else {
        nextState.mentionSearchValue = mention.replace('@', '')
      }
    }
  }

  nextState.text = text
  return nextState
}

export const getTextWithMentionInserted = (text, mention, mentionStartPosition, mentionSearchValue) => {
  const textBeforeMention = text.slice(0, mentionStartPosition)
  let textAfterMention = text.slice(mentionStartPosition + mentionSearchValue.length + 1)

  // Insert space after mention if it's at the end of input because:
  // 1. It's good UX
  // 2. react-native TextInput breaks when no space is added after mention
  if (textAfterMention.length === 0) {
    textAfterMention = ' '
  }

  return `${textBeforeMention}@${mention}${textAfterMention}`
}

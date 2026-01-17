import { Quill } from 'react-quill'
import { KeyCode } from 'models/domain/MessagesModel/types'
import get from 'lodash/get'

import doesStringContainWhitespace from 'common/utils/doesStringContainWhitespace'

class Mentions {

  constructor(quill, options) {
    this.quill = quill
    this.options = {
      ...options,
      minChars: 0,
      maxChars: 100,
    }

    this.lastEditorChangeEventName = null

    quill.on('editor-change', this.onTextChange.bind(this))

    quill.keyboard.addBinding({
      key: KeyCode.ENTER,
    }, () => this.onEnterPress())
    quill.keyboard.bindings[13].unshift(quill.keyboard.bindings[13].pop()) // override handlers order so that ours is first

    quill.keyboard.addBinding({
      key: KeyCode.TAB,
    }, () => this.onTabPress())
    quill.keyboard.bindings[9].unshift(quill.keyboard.bindings[9].pop())

    quill.keyboard.addBinding({
      key: KeyCode.TAB,
      shiftKey: true,
    }, () => this.onTabPress(true))
    quill.keyboard.bindings[9].unshift(quill.keyboard.bindings[9].pop())

    quill.keyboard.addBinding({
      key: 'escape',
    }, () => this.onEscapePress())

    quill.keyboard.addBinding({
      key: KeyCode.UP,
    }, () => this.onArrowUp())

    quill.keyboard.addBinding({
      key: KeyCode.DOWN,
    }, () => this.onArrowDown())
  }

  onEnterPress() {
    if (this.isOpen) {
      const { wasMentionInserted, wasUserInviting } = this.options.onSelectMention(true)
      if (!wasMentionInserted && !wasUserInviting) {
        return true
      } else if (!wasMentionInserted && wasUserInviting) {
        return false
      } else {
        this.hideMentionList()
        return false
      }
    } else {
      return true
    }
  }

  onTabPress(shiftKey) {
    if (this.isOpen) {
      if (shiftKey) {
        this.prevItem()
        return false
      } else {
        this.nextItem()
        return false
      }
    } else {
      return true
    }
  }

  onEscapePress() {
    if (this.isOpen) {
      this.hideMentionList()
      return false
    } else {
      return true
    }
  }

  onArrowUp() {
    if (this.isOpen) {
      this.prevItem()
      return false
    }
    return true
  }

  onArrowDown() {
    if (this.isOpen) {
      this.nextItem()
      return false
    }
    return true
  }

  nextItem() {
    this.options.onSelectNextItem()
  }

  prevItem() {
    this.options.onSelectPrevItem()
  }

  onTextChange(eventName, delta, oldDelta, source) {
    if (source === 'user') {
      this.onSomethingChange(eventName)
    }
  }

  showMentionList() {
    this.isOpen = true
    this.options.onSetMentionsTooltipIsOpen(true)
  }

  hideMentionList() {
    this.isOpen = false
    this.options.onSetMentionsTooltipIsOpen(false)
  }

  onSomethingChange(eventName) {
    // fix bug when inserting first char in line doesn't update cursor position in text-change event handler https://github.com/quilljs/quill/issues/1583
    if (eventName === 'text-change') {
      this.lastEditorChangeEventName = 'text-change'
    } else if (this.lastEditorChangeEventName === 'text-change') {
      this.lastEditorChangeEventName = 'selection-change'
    } else {
      this.options.onSetCursorPosition(get(this.quill.getSelection(), 'index', 0))
      return
    }

    const selection = this.quill.getSelection()
    if (selection === null || (selection.length && selection.length > 0)) {
      if (eventName !== 'selection-change') {
        this.hideMentionList()
      }
      return
    }

    const charBeforeCursor = this.quill.getText(selection.index - 1, 1)

    // close mention dropdown so it do not clash with emojis module
    if (charBeforeCursor === ':') {
      this.hideMentionList()
      return
    }
    this.cursorPos = selection.index
    this.options.onSetCursorPosition(selection.index)

    const textBeforeCursor = this.quill.getText(0, this.cursorPos)
    const nearestAtSignPosition = textBeforeCursor.lastIndexOf('@')

    if (nearestAtSignPosition === -1) {
      this.hideMentionList()
    } else {
      this.onAtSignInserted(nearestAtSignPosition, textBeforeCursor, selection)
    }
  }

  onAtSignInserted(nearestAtSignPosition, textBeforeCursor, selection) {
    let tempAtSignPosition
    while ( // eslint-disable-line no-cond-assign
      (tempAtSignPosition = textBeforeCursor.slice(0, nearestAtSignPosition - textBeforeCursor.length).lastIndexOf('@')) !== -1
    && !doesStringContainWhitespace(textBeforeCursor.substring(tempAtSignPosition))) {
      nearestAtSignPosition = tempAtSignPosition
    }

    const textFromAtSignToCursor = textBeforeCursor.substring(nearestAtSignPosition)
    const firstLetterBeforeAtSign = textBeforeCursor.substring(nearestAtSignPosition - 1, nearestAtSignPosition)
    if (doesStringContainWhitespace(textFromAtSignToCursor) || firstLetterBeforeAtSign.trim().length > 0) {
      this.options.onSelectMention(true, -1, textFromAtSignToCursor.slice(1, -1))
      this.hideMentionList()
    } else {
      const searchPhrase = textFromAtSignToCursor.slice(1)
      this.options.onSetSearchPhrase(searchPhrase)
      this.options.onSetAtPosition(selection.index - searchPhrase.length - 1)
      this.showMentionList()
    }
  }

}

Quill.register('modules/mentions', Mentions)


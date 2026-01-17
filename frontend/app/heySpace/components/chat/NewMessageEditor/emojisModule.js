import { Quill } from 'react-quill'
import { KeyCode } from 'models/domain/MessagesModel/types'

import doesStringContainWhitespace from 'common/utils/doesStringContainWhitespace'
import keycode from 'keycode'
import { emojiIndex } from 'emoji-mart'

const ENTER_KEY_CODE = 13
const TAB_KEY_CODE = 9

class Emojis {

  constructor(quill, props) {
    this.quill = quill
    this.props = {
      ...props,
      minChars: 2,
    }
    this.isEmojiListOpened = false
    this.cursorPos = null
    this.openingColonPosition = null

    quill.on('text-change', this.onTextChange.bind(this))

    quill.keyboard.addBinding({
      key: KeyCode.ENTER,
    }, () => this.onEnterPress())
    quill.keyboard.bindings[ENTER_KEY_CODE].unshift(quill.keyboard.bindings[ENTER_KEY_CODE].pop()) // override handlers order so that ours is first

    quill.keyboard.addBinding({
      key: KeyCode.TAB,
    }, () => this.onTabPress())
    quill.keyboard.bindings[TAB_KEY_CODE].unshift(quill.keyboard.bindings[TAB_KEY_CODE].pop())

    quill.keyboard.addBinding({
      key: KeyCode.TAB,
      shiftKey: true,
    }, () => this.onTabPress(true))
    quill.keyboard.bindings[TAB_KEY_CODE].unshift(quill.keyboard.bindings[TAB_KEY_CODE].pop())

    quill.keyboard.addBinding({
      key: 'escape',
    }, () => this.onEscapePress())

    quill.keyboard.addBinding({
      key: KeyCode.UP,
    }, () => this.onArrowUp())

    quill.keyboard.addBinding({
      key: KeyCode.DOWN,
    }, () => this.onArrowDown())

    quill.keyboard.addBinding({
      key: keycode('right'),
    }, () => this.onArrowRight())

    quill.keyboard.addBinding({
      key: keycode('left'),
    }, () => this.onArrowLeft())
  }

  onEnterPress() {
    if (this.isEmojiListOpened) {
      this.props.onEmojiPick()
      this.onCloseEmojiList()
      return false
    } else {
      return true
    }
  }

  onTabPress(shiftKey) {
    if (this.isEmojiListOpened) {
      if (shiftKey) {
        this.onHighlightPrevItem()
      } else {
        this.onHighlightNextItem()
      }
      return false
    } else {
      return true
    }
  }

  onEscapePress() {
    if (this.isEmojiListOpened) {
      this.onCloseEmojiList()
      return false
    } else {
      return true
    }
  }

  onArrowUp() {
    if (this.isEmojiListOpened) {
      this.onHighlightPrevItem()
      return false
    } else {
      return true
    }
  }

  onArrowDown() {
    if (this.isEmojiListOpened) {
      this.onHighlightNextItem()
      return false
    } else {
      return true
    }
  }

  onArrowRight() {
    if (this.isEmojiListOpened) {
      this.onHighlightNextItem()
      return false
    } else {
      return true
    }
  }

  onArrowLeft() {
    if (this.isEmojiListOpened) {
      this.onHighlightPrevItem()
      return false
    } else {
      return true
    }
  }

  onOpenEmojiList() {
    this.isEmojiListOpened = true
    this.props.onOpenEmojiList()
  }

  onCloseEmojiList() {
    this.isEmojiListOpened = false
    this.props.onCloseEmojiList()
  }

  onHighlightNextItem() {
    this.props.onSelectNextItem()
  }

  onHighlightPrevItem() {
    this.props.onSelectPrevItem()
  }

  onTextChange(delta, oldDelta, source) {
    if (source === 'user') {
      this.onChange()
    }
  }

  onInsertEmoji(emoji) {
    if (emoji) {
      this.quill.deleteText(this.openingColonPosition, Math.max(0, this.cursorPos - this.openingColonPosition), Quill.sources.API)
      this.quill.insertEmbed(this.openingColonPosition, 'emoji', emoji, Quill.sources.API)
      this.quill.insertText(this.openingColonPosition + 1, ' ', Quill.sources.API)
      this.quill.setSelection(this.openingColonPosition + 2, Quill.sources.API)
    }

    this.setCursorPosition(this.cursorPos - (this.cursorPos - this.openingColonPosition))
    this.setOpeningColonPosition(null)
    this.onCloseEmojiList()
  }

  onChange() {
    const selection = this.quill.getSelection()
    if (selection === null || (selection.length && selection.length > 0)) {
      return
    }

    this.setCursorPosition(selection.index)
    const charBeforeCursor = this.quill.getText(this.cursorPos - 1, 1)
    // close emojis list so it do not clash with mentions module
    if (charBeforeCursor === '@') {
      this.setOpeningColonPosition(null)
      this.onCloseEmojiList()
      return
    }

    const textBeforeCursor = this.quill.getText(0, this.cursorPos)
    let nearestColonPosition = textBeforeCursor.lastIndexOf(':')
    if (nearestColonPosition === textBeforeCursor.length - 1) {
      nearestColonPosition = textBeforeCursor.slice(0, -1).lastIndexOf(':')
    }
    const textFromColonToCursor = textBeforeCursor.substring(nearestColonPosition)
    const isWhiteSpaceBeforeColon = nearestColonPosition - 1 >= 0 ? textBeforeCursor[nearestColonPosition - 1] === ' ' : true
    const isValidSearchPhrase = isWhiteSpaceBeforeColon && nearestColonPosition !== -1 && !doesStringContainWhitespace(textFromColonToCursor)

    if (isValidSearchPhrase) {
      this.setOpeningColonPosition(this.cursorPos - textFromColonToCursor.length)
      if (textFromColonToCursor.length >= this.props.minChars + 1) {
        this.onOpenEmojiList()
        this.props.onSetSearchPhrase(textFromColonToCursor.replace(/:/g, ''))
      } else {
        this.onCloseEmojiList()
      }
    } else {
      this.setOpeningColonPosition(null)
      this.onCloseEmojiList()
    }

    const openingColonExists = this.openingColonPosition || this.openingColonPosition === 0

    if (charBeforeCursor === ':') {
      if (openingColonExists && isValidSearchPhrase) {
        const emojiSearch = emojiIndex.search(textFromColonToCursor.slice(1, -1))
        const emojiMatchingColonFormat = emojiSearch.filter(emoji => emoji.colons === textFromColonToCursor)[0]
        this.onInsertEmoji(emojiMatchingColonFormat)
      } else {
        this.setOpeningColonPosition(this.cursorPos - 1)
      }
    } else {
      // do nothing
    }
  }

  setCursorPosition(position) {
    this.cursorPos = position
    this.props.onSetCursorPosition(position)
  }

  setOpeningColonPosition(position) {
    this.openingColonPosition = position
    this.props.onSetOpeningColonPosition(position)
  }

}

Quill.register('modules/emojis', Emojis)

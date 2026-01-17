import { List } from 'immutable'
import { MentionType } from 'models/domain/MessagesModel/types'
import unescape from 'lodash/unescape'

import { emojiRegex, mentionRegex, hailRegex } from './MarkdownRenderer'

const emptyList = new List()
const mentionOrHailOrEmojiRegex = /<@[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}>|<!\w+>|:\S+:/

export default class TextToQuillOpsConverter {

  constructor(userNicknamesByIds = emptyList) {
    this.userNicknamesByIds = userNicknamesByIds
  }

  setUserNicknamesByIds = (userNicknamesByIds = emptyList) => {
    this.userNicknamesByIds = userNicknamesByIds
  }

  getOpsFromText = (text, ops = []) => {
    if (!text) {
      return ops
    }
    const match = text.match(mentionOrHailOrEmojiRegex)
    if (!match) {
      if (text.length === 0) {
        return ops
      } else {
        return ops.concat(this.createTextOp(text, 0, text.length))
      }
    } else {
      const { index } = match
      const entityPlainText = match[0]
      const entityLength = entityPlainText.length
      if (index === 0) {
        ops.push(this.createEntityBlot(entityPlainText))
      } else {
        ops.push(this.createTextOp(text, 0, index))
        ops.push(this.createEntityBlot(entityPlainText))
      }
      return this.getOpsFromText(text.slice(index + entityLength), ops)
    }
  }

  createTextOp = (string, startIndex, endIndex) => ({
    insert: unescape(string.slice(startIndex, endIndex)),
  })

  createEntityBlot = (entityPlainText) => {
    const isEmoji = entityPlainText.match(emojiRegex)
    const isMention = entityPlainText.match(mentionRegex)
    const isHail = entityPlainText.match(hailRegex)

    if (isEmoji) {
      return this.createEmojiBlot(entityPlainText)
    } else if (isMention || isHail) {
      return this.createMentionBlot(entityPlainText)
    } else {
      return this.createTextOp(entityPlainText)
    }
  }

  createEmojiBlot = (emojiColonFormat) => ({
    insert: {
      emoji: {
        colons: emojiColonFormat,
      },
    },
  })

  createMentionBlot = (mentionPlainText) => {
    // mentionData is either userId or hail type (eg. here, space etc)
    const mentionData = mentionPlainText.slice(2, -1)
    const mentionType = this.getMentionType(mentionPlainText)
    switch (mentionType) {
      case MentionType.HAIL: {
        const type = this.getHailType(mentionData)
        if (!type) {
          throw new Error(`Unsupported hail type for mention: ${mentionPlainText}`)
        } else {
          return this.createHailMentionBlot(mentionData)
        }
      }
      case MentionType.USER: {
        return this.createUserMentionBlot(mentionData)
      }
      default: {
        throw new Error(`Unsupported mention type for mention: ${mentionPlainText}`)
      }
    }
  }

  createHailMentionBlot = (hail) => ({
    insert: {
      mention: {
        type: this.getHailType(hail),
        displayValue: hail,
      },
    },
  })

  createUserMentionBlot = (userId) => ({
    insert: {
      mention: {
        userId,
        type: MentionType.USER,
        displayValue: this.userNicknamesByIds.get(userId),
      },
    },
  })

  getHailType = (hail) => {
    switch (hail) {
      case MentionType.HERE: {
        return MentionType.HERE
      }
      case MentionType.SPACE:
      case MentionType.CHANNEL: {
        return MentionType.SPACE
      }
      default:
        return null
    }
  }

  getMentionType = (mentionPlainText) => {
    if (mentionPlainText.startsWith('<@')) {
      return MentionType.USER
    } else if (mentionPlainText.startsWith('<!')) {
      return MentionType.HAIL
    } else {
      return null
    }
  }

}

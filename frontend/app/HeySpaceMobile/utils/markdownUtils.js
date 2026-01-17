import { List } from 'immutable'
import escape from 'lodash/escape'
import { hailRegex, mentionRegex } from '../../common/models/domain/MessagesModel/MarkdownRenderer'
import { MentionType } from 'models/domain/MessagesModel/types'

const hailTypes = [MentionType.HERE, MentionType.CHANNEL, MentionType.SPACE]
const emptyList = new List()

export const isNicknameUnique = (nickname, usersNicknames) =>
  usersNicknames.filter(name => name === nickname).size === 1

export const isMention = (text, usersNicknames) => {
  const trimmedText = text.trim().slice(1)
  return usersNicknames.includes(trimmedText)
}

export const isHail = (text) => {
  const trimmedText = text.trim().slice(1)

  return hailTypes.indexOf(trimmedText) >= 0
}

/*
  parse String to Array<{ text: String, isMention: bool, isHail: bool }>
*/
export const parseStringToInputArray = (string, usersNicknames) => {
  let text = string
  let textElements = emptyList
  const matches = text.match(/ @|^@/g)

  if (matches) {
    let suffix = text
    matches.forEach((match, key) => {
      const index = text.charAt(0) === '@' && key === 0 ? 0 : text.indexOf(' @') + 1
      const prefix = text.slice(0, index)
      let mention = text.slice(index)
      const mentionEndIndex = mention.indexOf(' ') > 0 ? mention.indexOf(' ') : mention.length

      suffix = mention.slice(mentionEndIndex)
      mention = mention.slice(0, mentionEndIndex)

      textElements = textElements.push({
        text: prefix,
        isMention: false,
        isHail: false,
      })
      textElements = textElements.push({
        text: mention,
        isMention: isMention(mention, usersNicknames),
        isHail: isHail(mention),
      })

      text = suffix
    })
  }

  textElements = textElements.push({
    text,
    isMention: false,
    isHail: false,
  })

  return textElements
}

export const extractMentionedUserIds = (text = '') => {
  const matches = text.match(mentionRegex) || []
  return matches.map(mentionMatch => mentionMatch.slice(2, mentionMatch.length - 1))
}

export const extractHails = (text = '') => {
  const matches = text.match(hailRegex) || []
  return matches.map(hailMatch => hailMatch.slice(2, hailMatch.length - 1))
}

export const parsePlainTextMessage = (text, usersNicknames, usersEmails) => {
  let parsedMessageText = ''
  const textArray = parseStringToInputArray(escape(text), usersNicknames)

  textArray.forEach((textElements) => {
    if (textElements.isMention) {
      const mention = textElements.text.slice(1)
      const userId = usersNicknames.keyOf(mention) || usersEmails.keyOf(mention)

      parsedMessageText = `${parsedMessageText}<@${userId}> `
    } else if (textElements.isHail) {
      const mention = textElements.text.slice(1)

      parsedMessageText = `${parsedMessageText}<!${mention}> `
    } else {
      parsedMessageText = `${parsedMessageText}${textElements.text}`
    }
  })

  const mentionedUserIds = extractMentionedUserIds(parsedMessageText)
  const hails = replaceAliasHails(extractHails(parsedMessageText))

  return {
    parsedMessageText,
    mentionedUserIds,
    hails,
  }
}

function replaceAliasHails(hails) {
  const newHails = hails
  const channelHailIndex = newHails.indexOf(MentionType.CHANNEL)
  if (channelHailIndex > -1) {
    newHails[channelHailIndex] = MentionType.SPACE
  }
  return newHails
}

export const parseMarkdownToText = (markdown, usersNicknames) => {
  let result = markdown
  const mentionsMatches = extractMentionedUserIds(markdown)
  const hailsMatches = extractHails(markdown)

  if (mentionsMatches) {
    mentionsMatches.forEach(userId => {
      const nickname = usersNicknames.get(userId)
      result = result.replace(`<@${userId}>`, `@${nickname}`)
    })
  }

  if (hailsMatches) {
    hailsMatches.forEach(hail => {
      result = result.replace(`<!${hail}>`, `@${hail}`)
    })
  }

  return result
}

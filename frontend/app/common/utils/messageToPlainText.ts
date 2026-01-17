import { mentionRegex, hailRegex } from '../models/domain/MessagesModel/MarkdownRenderer'
import unescape from 'lodash/unescape'

export default function toPlainText(messageContent, userNicknamesByIds) {
  if (typeof messageContent === 'string') {
    return convertMarkdownToPlainText(messageContent, userNicknamesByIds)
  } else {
    return convertDeltaToPlainText(messageContent)
  }
}


function convertDeltaToPlainText(delta) {
  if (!delta || !Array.isArray(delta.ops)) {
    return ''
  }
  return delta.ops.reduce(function (text, operation) {
    if (!operation.insert) {
      return text
    }
    if (operation.insert.mention) {
      const { username, value } = operation.insert.mention
      return `${text}@${username || value || ''}`
    } else if (typeof operation.insert !== 'string') {
      return `${text} `
    }
    return `${text}${operation.insert}`
  }, '')
}

function convertMarkdownToPlainText(source, userNicknamesByIds) {
  let match = source.match(mentionRegex)

  if (match) {
    match.forEach(mentionEntityString => {
      const maybeUserId = mentionEntityString.slice(2, -1)
      const userNickname = userNicknamesByIds.get(maybeUserId)

      if (userNickname) {
        source = source.replace(mentionEntityString, `@${userNickname}`)
      }
    })
  }

  match = source.match(hailRegex)
  if (match) {
    match.forEach(hailEntityString => {
      const hailDisplayValue = hailEntityString.slice(2, -1)
      source = source.replace(hailEntityString, `@${hailDisplayValue}`)
    })
  }

  return unescape(source)
}

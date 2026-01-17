import Delta from 'quill-delta'
import { List } from 'immutable'
import escape from 'lodash/escape'
import { Id } from 'common/utils/identifier'
import unescape from 'lodash/unescape'
import { urlRegex } from './MarkdownRenderer'
import { MentionType, UsersProjectMentionDataInterface } from './types'
import fuzzysearch from 'fuzzysearch'

const emptyList = List()

export function isPureTextMessage(message) {
  return message.attachments.size === 0 && message.text !== null
}

export function extractTextFromOperation(operation, shouldEscapeText = true) {
  if (operation.hasOwnProperty('insert')) {
    if (typeof operation.insert === 'string') {
      return shouldEscapeText ? escape(operation.insert) : operation.insert
    } else if (operation.insert.mention) {
      return convertMentionBlotToPlainText(operation.insert.mention)
    } else if (operation.insert.emoji) {
      return shouldEscapeText ? escape(operation.insert.emoji.colons) : operation.insert.emoji.colons || ''
    } else {
      return ''
    }
  } else {
    return ''
  }
}

export function convertMentionBlotToPlainText(mentionBlot) {
  switch (mentionBlot.type) {
    case MentionType.USER:
      return `<@${mentionBlot.userId}>`
    case MentionType.HERE:
    case MentionType.SPACE:
      return `<!${mentionBlot.displayValue}>`
    default:
      throw new Error(`Unsupported mention type ${mentionBlot.type}`)
  }
}

export function extractMentionAndHailsFromMessageNode(node, mentionedUserIds = emptyList, hails = emptyList) {
  if (Array.isArray(node.content)) {
    return node.content.map(astNode => extractMentionAndHailsFromMessageNode(astNode, mentionedUserIds, hails))
  } else if (node.type === 'text') {
    return {
      mentionedUserIds,
      hails,
    }
  } else if (node.type === 'mention') {
    const { userId } = node
    mentionedUserIds.push(userId)
    return {
      mentionedUserIds,
      hails,
    }
  } else if (node.type === 'hail') {
    hails.push(node.content)
    return {
      mentionedUserIds,
      hails,
    }
  } else {
    return {
      mentionedUserIds,
      hails,
    }
  }
}

export function parseMessageText(text: string): string | Delta {
  // TODO: remove parsing logic after all messages on the backend will be transformed
  // from Quill to plain string markdown format

  if (!isQuillMessage(text)) {
    return text
  }

  const quillMessage = JSON.parse(text)

  if (Array.isArray(quillMessage)) {
    return new Delta(quillMessage)
  }

  return quillMessage
}

function isQuillMessage(text: string): boolean {
  try {
    const parsedText = JSON.parse(text)
    return typeof parsedText === 'object' && parsedText !== null && parsedText.ops
  } catch (error) {
    // not a valid JSON so not quill message
    return false
  }
}

export function appendReplyToMessage(
  responseContent: string,
  repliedContent: string,
  senderId: Id,
): string {
  const unescapedRepliedContent = unescape(repliedContent).trim()
  const isReplyOfReply = unescapedRepliedContent.startsWith('>')
  const senderBlock = createSenderBlock(senderId)

  let textLines = unescapedRepliedContent.split('\n')
  let formattedLines = fillReplyTextWithQuoteMark(textLines)

  if (isReplyOfReply) {
    const lastReplyStartIndex = findLastReplyStartIndex(formattedLines)
    formattedLines = formattedLines.slice(lastReplyStartIndex, formattedLines.length)
    formattedLines[0] = `>${senderBlock}: ${formattedLines[0]}`

    const finalText = formattedLines.join('\n')
    return `${finalText}\n
    ${responseContent}`
  } else {
    const finalText = formattedLines.join('\n')
    return `>${senderBlock}: ${finalText}\n
    ${responseContent}`
  }
}


function fillReplyTextWithQuoteMark(textLines: string[]): string[] {
  return textLines.map(line => {
    if (line.trim().length === 0) {
      return '>'
    }
    return line
  })
}


function findLastReplyStartIndex(textLines: string[]): number {
  for (let i = textLines.length - 1; i > -1; i--) {
    const currentLine = textLines[i]
    const previousLine = textLines[i - 1]
    const lineStartWithQuote = currentLine.trim().startsWith('>')
    const previousLineStartsWithQuote = previousLine && previousLine.trim().startsWith('>')
    if (!lineStartWithQuote && previousLineStartsWithQuote) {
      return i
    }
  }
}

export function createUserQuote(senderId: Id, content: string = ''): string {
  const senderBlock = createSenderBlock(senderId)
  return `>${senderBlock}: ${content}`
}

export function createMarkdownLink(fileUrl: string, fileName: string): string {
  return `[${fileName}](${fileUrl})`
}

export function createSenderBlock(senderId: Id): string {
  return `<@${senderId}>`
}

export function isUrl(text: string): boolean {
  return text.match(urlRegex) !== null
}

export function getFilteredMentionSuggestion(
  searchValue: string,
  mentionSuggestions: List<UsersProjectMentionDataInterface>
): List<UsersProjectMentionDataInterface> {
  if (searchValue === '') {
    return mentionSuggestions
  }
  let searchPhrase = searchValue.toLowerCase()
  if (searchPhrase.startsWith('@')) {
    searchPhrase = searchPhrase.substring(1)
  }

  return mentionSuggestions.filter(mentionSuggestion => {
    const isMatchingDisplayValue = mentionSuggestion.displayValue.toLowerCase().replace('.', '').startsWith(searchPhrase)
    const isMatchingFullName = fuzzysearch(searchPhrase, mentionSuggestion.fullName.toLowerCase())
    const isMatchingEmail = mentionSuggestion.email.toLowerCase().startsWith(searchPhrase)

    return isMatchingDisplayValue || isMatchingFullName || isMatchingEmail
  }) as List<UsersProjectMentionDataInterface>
}

export function createMentionComparatorForPhrase(searchPhrase: string):
  (mentionA: UsersProjectMentionDataInterface, mentionB: UsersProjectMentionDataInterface) => number {
  const searchPhraseLowerCase = searchPhrase.toLowerCase()
  return (mentionA: UsersProjectMentionDataInterface, mentionB: UsersProjectMentionDataInterface) => {
    if ((mentionA.type === MentionType.USER) !== (mentionB.type === MentionType.USER)) {
      // One of mentions is for user and another is not: user mention comes last.
      return mentionA.type === MentionType.USER ? 1 : -1
    }
    const compareValueA = `${mentionA.displayValue.replace('.', '')} ${mentionA.fullName}`.toLowerCase()
    const compareValueB = `${mentionB.displayValue.replace('.', '')} ${mentionB.fullName}`.toLowerCase()
    let positionA = compareValueA.indexOf(searchPhraseLowerCase)
    let positionB = compareValueB.indexOf(searchPhraseLowerCase)
    if (positionA < 0) {
      positionA = Number.MAX_SAFE_INTEGER
    }
    if (positionB < 0) {
      positionB = Number.MAX_SAFE_INTEGER
    }
    return (positionA === positionB)
      ? 0
      : (positionA < positionB ? -1 : 1)
  }
}

export function isEmptyMessage(messageContent: Delta): boolean {
  if (messageContent.ops.length === 0) {
    return true
  }

  if (messageContent.ops.length > 1) {
    return false
  }

  const [operation] = messageContent.ops
  if (operation.insert === '\n') {
    return true
  }

  return false
}
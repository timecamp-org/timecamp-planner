import { unescape } from 'lodash'
import { getUserNickname } from '../../../../utils'
import { MarkdownPrinter } from './types';

const getPlainTextRenderers: MarkdownPrinter = (self) => ([
  {
    type: 'text',
    renderFn: (node, output, state) => unescape(node.content),
  },
  {
    type: 'paragraph',
    renderFn: (node, output, state) => `${output(node.content, state)}`
  },
  {
    type: 'em',
    renderFn: (node, output, state) => `_${output(node.content, state)}_`,
  },
  {
    type: 'del',
    renderFn: (node, output, state) => `~${output(node.content, state)}~`,
  },
  {
    type: 'strong',
    renderFn: (node, output, state) => `*${output(node.content, state)}*`
  },
  {
    type: 'heading',
    renderFn: (node, output, state) => `#${output(node.content, state)}`
  },
  {
    type: 'link',
    renderFn: (node, output, state) => output(node.content, state)
  },
  {
    type: 'codeBlock',
    renderFn: (node, output, state) => {
      let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(unescape(node.content.slice(3, -3)))
      codeContent = self.replaceHailsInRenderedCode(codeContent)
      return `\`\`\`${codeContent}\`\`\``
    },
  },
  {
    type: 'inlineCode',
    renderFn: (node, output, state) => {
      let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(unescape(node.content))
      console.log('inlineCode codeContent', codeContent)
      codeContent = self.replaceHailsInRenderedCode(codeContent)
      return `\`${codeContent}\``
    },
  },
  {
    type: 'mention',
    renderFn:(node, output, state) => {
      const userData = self.usersData.find(user => user.id === node.userId)
      if (userData) {
        const userNickname = getUserNickname(userData)
        return `@${userNickname}`
      } else {
        return `<@${node.userId}>`
      }
    }
  },
  {
    type: 'hail',
    renderFn: (node, output, state) => `@${node.content}`,
  },
  {
    type: 'emoji',
    renderFn: (node, output, state) => node.colonsEmojiCode
  },
  {
    type: 'emoticon',
    renderFn: (node, output, state) => node.emoticon
  },
  {
    type: 'list',
    renderFn: (node, output, state) => output(node.items, state),
    match: (source, state, prevCapture) => null,
  },
  {
    type: 'url',
    renderFn: (node, output, state) => output(node.items, state),
    match: (source, state, prevCapture) => null,
  },
])


export default getPlainTextRenderers

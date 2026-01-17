import { unescape } from 'lodash'
import { getUserNickname } from '../../../../utils'
import { MarkdownPrinter } from './types';

const styles = {
  codeBlock: `white-space: pre-wrap;
  background: #f9f9f9;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 10px;
  margin: 0;`,
  inlineCode: `
  background: #f9f9f9;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin: 0;
  font-size: 12px;
  white-space: normal;
  padding: 5px;
  color: #d72b3f;
  line-height: 30px;`,
}

const getHtmlRenderers: MarkdownPrinter = (self) => ([
  {
    type: 'text',
    renderFn: (node, output, state) => unescape(node.content),
  },
  {
    type: 'codeBlock',
    renderFn: (node, output, state) => {
      let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(unescape(node.content.slice(3, -3)))
      codeContent = self.replaceHailsInRenderedCode(codeContent)
      return `<pre style="${styles.codeBlock}">${codeContent}</pre>`
    },
  },
  {
    type: 'inlineCode',
    renderFn: (node, output, state) => {
      let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(unescape(node.content))
      console.log('inlineCode codeContent', codeContent)
      codeContent = self.replaceHailsInRenderedCode(codeContent)
      return `<code style="${styles.inlineCode}">${codeContent}</code>`
    },
  },
  {
    type: 'mention',
    renderFn:(node, output, state) => {
      const userData = self.usersData.find(user => user.id === node.userId)
      if (userData) {
        const userNickname = getUserNickname(userData)
        return `<span style="color: ${self.mentionColor};">@${userNickname}</span>`
      } else {
        return `<span><@${node.userId}></span>`
      }
    }
  },
  {
    type: 'hail',
    renderFn: (node, output, state) => `<span style="color: ${self.mentionColor};">@${node.content}</span>`,
  },
  {
    type: 'emoji',
    renderFn: (node, output, state) => `<span>${node.colonsEmojiCode}</span>`
  },
  {
    type: 'emoticon',
    renderFn: (node, output, state) => `<span>${node.emoticon}</span>`
  },
])


export default getHtmlRenderers

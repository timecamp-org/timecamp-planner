import { Quill } from 'react-quill'
import styles from './mentionsStyles.css'

const Embed = Quill.import('blots/embed')


function mentionBlot(color) {
  class MentionBlot extends Embed {

    static create(data) {
      const node = super.create()
      const atSign = document.createElement('span')
      atSign.className = styles['ql-mention-at-sign']
      atSign.innerHTML = '@'
      node.appendChild(atSign)
      node.innerHTML += data.displayValue
      node.style.color = color
      if (data.userId) {
        node.dataset.userId = data.userId
      }
      node.dataset.type = data.type
      node.dataset.displayValue = data.displayValue
      return node
    }

    static value(domNode) {
      return {
        userId: domNode.dataset.userId,
        type: domNode.dataset.type,
        displayValue: domNode.dataset.displayValue,
      }
    }

  }

  MentionBlot.blotName = 'mention'
  MentionBlot.tagName = 'span'
  MentionBlot.className = styles.mention

  Quill.register(MentionBlot)
}

export default mentionBlot

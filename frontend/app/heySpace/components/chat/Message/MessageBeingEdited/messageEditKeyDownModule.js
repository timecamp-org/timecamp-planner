import { Quill } from 'react-quill'
import { KeyCode } from 'models/domain/MessagesModel/types'

class MessageEditKeyDown {

  constructor(quill, props) {
    this.quill = quill
    this.props = props

    quill.keyboard.addBinding({
      key: KeyCode.ENTER,
    }, () => this.onEnter(false))
    quill.keyboard.bindings[13].unshift(quill.keyboard.bindings[13].pop()) // override handlers order so that ours is first

    quill.keyboard.addBinding({
      key: KeyCode.ENTER,
      shiftKey: true,
    }, () => this.onEnter(true))
    quill.keyboard.bindings[13].unshift(quill.keyboard.bindings[13].pop()) // override handlers order so that ours is first
  }

  onEnter(shiftKey) {
    if (shiftKey) {
      return true
    } else {
      this.props.onMessageEditConfirmed()
      return false
    }
  }

}

Quill.register('modules/messageEditKeyDown', MessageEditKeyDown)

import { Quill } from 'react-quill'
import { KeyCode } from 'models/domain/MessagesModel/types'

class EditLastMessage {

  constructor(quill, props) {
    this.quill = quill
    this.props = props

    quill.keyboard.addBinding({
      key: KeyCode.UP,
    }, () => this.onArrowUp())
  }

  onArrowUp() {
    if (this.quill.getLength() === 1) {
      this.props.onEditCurrentUserLastMessage()
      return false
    } else {
      return true
    }
  }

}

Quill.register('modules/editLastMessage', EditLastMessage)

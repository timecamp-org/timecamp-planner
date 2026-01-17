import { Quill } from 'react-quill'
import { KeyCode } from 'models/domain/MessagesModel/types'

class SendMessageModule {

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
      if (this.quill.getLength() > 1) {
        let { ops } = this.quill.getContents()
        let firstOperation
        if (ops.length === 1 && typeof (firstOperation = ops[0].insert) === 'string' && /^[\s|↵]+$/.test(firstOperation)) {
          return false
        }
        ops = ops.reduce((result, operation, index, opsArray) => {
          if (typeof operation.insert !== 'string') {
            return result.concat(operation)
          } else {
            if (index === 0) {
              const { insert, ...rest } = operation
              let newInsert = insert.replace(/^[\s|↵]+/, '')
              if (opsArray.length === 1) {
                newInsert = newInsert.replace(/[\n|↵]+$/, '\n')
              }
              const newOperation = { insert: newInsert, ...rest }
              return result.concat(newOperation)
            } else if (index === opsArray.length - 1) {
              const { insert, ...rest } = operation
              const newInsert = insert.replace(/[\s|↵]+$/, '')
              const newOperation = { insert: `${newInsert}\n`, ...rest }
              return result.concat(newOperation)
            } else {
              return result.concat(operation)
            }
          }
        }, [])

        this.props.onSendMessage(ops)
      }
      return false
    }
  }

}

Quill.register('modules/sendMessage', SendMessageModule)

import React from 'react'
import BaseComponent from 'BaseComponent'

import { extractTextFromOperation } from 'models/domain/MessagesModel/utils'

function Enhance(ComposedComponent) {
  class EnhanceQuillOutput extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={this.getTextFromQuill()}
        />
      )
    }

    getTextFromQuill() {
      let formattedMessageText = ''
      if (this.props.text.ops) {
        this.props.text.ops.forEach((operation) => {
          formattedMessageText = `${formattedMessageText}${extractTextFromOperation(operation, false)}`
        })
      }

      return formattedMessageText
    }

  }

  return EnhanceQuillOutput
}

export default Enhance

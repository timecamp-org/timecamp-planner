import React from 'react'

import BaseComponent from 'BaseComponent'
import { Animated, Keyboard } from 'react-native'

function enhance(ComposedComponent) {
  class EnhanceBottomDescriptionEditorButtons extends BaseComponent {

    static propTypes = {

    }

    constructor(props) {
      super(props)
      this.paddingInput = new Animated.Value(0)
    }

    componentDidMount() {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    }

    componentWillUnmount() {
      this.keyboardWillShowSub.remove()
      this.keyboardWillHideSub.remove()
    }

    keyboardWillShow = (event) => {
      Animated.timing(this.paddingInput, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }).start()
    }

    keyboardWillHide = (event) => {
      Animated.timing(this.paddingInput, {
        duration: event.duration,
        toValue: 0,
      }).start()
    }

    render() {
      return (
        <ComposedComponent
          paddingInput={this.paddingInput}
          onCancelEditingDescription={this.props.onCancelEditingDescription}
          onSaveDescription={this.props.onSaveDescription}
        />
      )
    }

  }

  return EnhanceBottomDescriptionEditorButtons
}

export default enhance

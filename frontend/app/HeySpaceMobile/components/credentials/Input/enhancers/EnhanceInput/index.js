import React from 'react'
import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceInput extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    state = {
      value: '',
      validation: null,
    }

    render() {
      return (
        <ComposedComponent
          shouldRenderHeaders={this.props.shouldRenderHeaders}
          primaryHeaderText={this.props.primaryHeaderText}
          secondaryHeaderText={this.props.secondaryHeaderText}

          placeholder={this.props.placeholder}
          textContentType={this.props.textContentType}
          secureTextEntry={this.props.secureTextEntry}
          humanMessage={this.props.humanMessage}

          value={this.state.value}
          validation={this.state.validation}

          innerRef={this.props.innerRef}
          keyboardType={this.props.keyboardType}
          onSubmitEditing={this.props.onSubmitEditing}
          onChangeText={this.onChangeText}
          onBlur={this.onBlur}
          onSecondaryHeaderClick={this.props.onSecondaryHeaderClick}
        />
      )
    }

    getValue() {
      return this.state.value
    }

    isValid() {
      const validation = this.props.validator(this.state.value)

      if (!validation.isValid && (!this.state.validation || this.state.validation.isValid)) {
        this.onSetValidation(validation)
      }

      return validation
    }

    onSetValidation(validation) {
      this.setState({
        validation,
      })
    }

    onChangeText(value) {
      this.setState({
        value,
      })

      if (this.props.onChangeText) {
        this.props.onChangeText(value)
      }
    }

    onBlur() {
      if (this.props.validator) {
        const validation = this.props.validator(this.state.value)

        if (!validation.isValid) {
          this.onSetValidation(validation)
        } else {
          this.onSetValidation(null)
        }
      }
    }

    componentDidMount() {
      if (this.props.outerRef) {
        this.props.outerRef(this)
      }
    }

  }

  return EnhanceInput
}

export default Enhance

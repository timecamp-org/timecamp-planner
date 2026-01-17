import React from 'react'
import autobind from 'auto-bind'

class PureBaseComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    autobind(this)
  }
}

export default PureBaseComponent

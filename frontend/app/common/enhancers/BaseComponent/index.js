import React from 'react'
import autobind from 'auto-bind'

class BaseComponent extends React.Component {

  constructor(props) {
    super(props)
    autobind(this)
  }

}

export default BaseComponent

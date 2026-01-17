import React from 'react'
import ReactDOM from 'react-dom'

class PopperPortal extends React.Component {

  constructor(props) {
    super(props)
    this.domElement = document.createElement('div')
    this.popperRoot = document.getElementById(props.popperRootId || 'popper-root')
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.domElement)
  }

  componentDidMount() {
    if (this.popperRoot) {
      this.popperRoot.appendChild(this.domElement)
    }
  }

  componentWillUnmount() {
    if (this.popperRoot) {
      this.popperRoot.removeChild(this.domElement)
    }
  }

}


export default PopperPortal

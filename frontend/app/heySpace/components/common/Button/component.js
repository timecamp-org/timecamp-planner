import React from 'react'
import styles from './styles.css'
import { doNothing } from 'common/utils'

import PropTypes from 'prop-types'

Button.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  isDisabled: PropTypes.bool,

  onClick: PropTypes.func,
  innerRef: PropTypes.func,
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

Button.defaultProps = {
  style: undefined,
  isDisabled: false,

  innerRef: doNothing,
  onClick: doNothing,
  onMouseDown: doNothing,
  onKeyDown: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
}

function Button(props) {
  return (
    <button
      className={props.className ? props.className : styles.Component}
      style={props.style ? props.style : {}}
      tabIndex={props.tabIndex}

      type={props.type}
      id={props.id}
      disabled={props.isDisabled}

      ref={button => props.innerRef(button)}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onKeyDown={props.onKeyDown}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}

    >
      {props.children}
    </button>
  )
}

export default Button

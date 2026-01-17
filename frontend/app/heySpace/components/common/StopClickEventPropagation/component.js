import React from 'react'

const onClick = event => event.stopPropagation()

function StopClickEventPropagation(props) {
  return (
    <span onClick={onClick} className={props.className}>
      {props.children}
    </span>
  )
}

export default StopClickEventPropagation

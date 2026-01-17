import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { doNothing } from 'common/utils'

MessageInternalLink.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string.isRequired,

  onClick: PropTypes.func.isRequired,
}

MessageInternalLink.defaultProps = {
  onClick: doNothing,
}

function MessageInternalLink(props) {
  return (
    <Link key={props.key} className={props.className} to={props.link} onClick={props.onClick}>{props.children}</Link>
  )
}

export default MessageInternalLink

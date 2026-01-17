import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

PersonFullNameAndEmail.propTypes = {
  secondItemClassName: PropTypes.string,
  firstItemClassName: PropTypes.string,

  fullName: PropTypes.string,
  email: PropTypes.string,
  isBot: PropTypes.bool,
}

PersonFullNameAndEmail.defaultProps = {
  secondItemClassName: '',
  firstItemClassName: '',
  isBot: false,
}

function PersonFullNameAndEmail(props) {
  return (
    <Fragment>
      {props.fullName && <span className={props.firstItemClassName}>
        {props.fullName}
      </span>}
      {props.email && !props.isBot && <span className={props.fullName ? props.secondItemClassName : props.firstItemClassName}>
        {props.email}
      </span>}
    </Fragment>
  )
}

export default PersonFullNameAndEmail

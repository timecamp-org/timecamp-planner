import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

TagName.propTypes = {
  name: PropTypes.string,
}

TagName.defaultProps = {
  name: '',
}

function TagName(props) {
  return (
    <span
      className={styles.component}
    >
      {props.name}
    </span>
  )
}

export default TagName

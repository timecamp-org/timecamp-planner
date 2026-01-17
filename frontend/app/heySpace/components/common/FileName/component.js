import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import { doNothing } from 'common/utils'

FileName.propTypes = {
  className: PropTypes.string,
  fileName: PropTypes.string,
}

FileName.defaultProps = {
  fileName: '',
}

function FileName(props) {
  return (
    <div className={styles.Component}>{props.fileName}</div>
  )
}

export default FileName

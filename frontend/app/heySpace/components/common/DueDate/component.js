import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import styles from './styles.css'
import { format } from 'common/utils/dateOperations'

DueDate.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  dueDate: PropTypes.number,
  format: PropTypes.string,
  isColorsHidden: PropTypes.bool,
  onClick: PropTypes.func,
}

DueDate.defaultProps = {
  className: '',
  format: 'MMM, D',
  isColorsHidden: false,
  onClick: doNothing,
}

function DueDate(props) {
  return (
    <div
      className={props.className || styles.dueDate}
      style={{ color: props.isColorsHidden ? undefined : props.color }}
      onClick={props.onClick}
    >
      {format(props.dueDate, props.format)}
    </div>
  )
}

export default DueDate

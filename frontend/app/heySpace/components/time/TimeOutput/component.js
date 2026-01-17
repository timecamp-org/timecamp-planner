import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import { format } from 'common/utils/dateOperations'
import { i18n } from 'i18n'

TimeOutput.propTypes = {
  className: PropTypes.string,
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  userTimeFormat: PropTypes.string.isRequired,
  shouldDisplayDate: PropTypes.bool,

  leftText: PropTypes.string,
  rightText: PropTypes.string,
  tabIndex: PropTypes.number,

  onClick: PropTypes.func,
}

TimeOutput.defaultProps = {
  className: undefined,
  shouldDisplayDate: false,

  leftText: '',
  rightText: '',
  tabIndex: undefined,

  onClick: doNothing,
}

function TimeOutput(props) {
  return (
    <span
      className={`${props.className}`}
      onClick={props.onClick}
      tabIndex={props.tabIndex}
    >
      {props.leftText}
      {`${props.shouldDisplayDate ? i18n.t(`{{time}} at `, { time: format(props.timestamp, 'MMM DD', { shouldAppendYearIfDifferentThanCurrent: true }) }) : ''}${format(props.timestamp, props.userTimeFormat)}`}
      {props.rightText}
    </span>
  )
}

export default (TimeOutput)

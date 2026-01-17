import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import { convertTimestampsToDateRange } from 'common/utils/dateOperations'

DateRangeOutput.propTypes = {
  className: PropTypes.string,

  startTimestamp: PropTypes.number,
  endTimestamp: PropTypes.number,
  shouldUsePredefinedRanges: PropTypes.bool,
  tabIndex: PropTypes.number,

  onClick: PropTypes.func,
}

DateRangeOutput.default = {
  className: undefined,

  shouldUsePredefinedRanges: true,
  tabIndex: undefined,

  onClick: doNothing,
}

function DateRangeOutput(props) {
  return (
    <span
      tabIndex={props.tabIndex}
      className={`${props.className}`}
      onClick={props.onClick}
    >
      {
        convertTimestampsToDateRange(props.startTimestamp, props.endTimestamp, props.shouldUsePredefinedRanges)
      }
    </span>
  )
}

export default DateRangeOutput

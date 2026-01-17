import React, { MouseEventHandler, FC } from 'react'
import styles from './styles.css'

import { doNothing } from 'common/utils'
import { format } from 'common/utils/dateOperations'

export type StartDateInterface = {
  startDate: number,
  className?: string,
  format?: string,
  onClick?: MouseEventHandler<HTMLDivElement>,
}

const defaultProps = {
  format: 'MMM, D',
  onClick: doNothing,
}

const StartDate: FC<StartDateInterface> = (props) => (
  <div
    className={props.className ? props.className : styles.startDate}
    onClick={props.onClick}
  >
    {format(props.startDate, props.format)}
  </div>
)

StartDate.defaultProps = defaultProps

export default StartDate

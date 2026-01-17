import React from 'react'
import styles from './styles.css'
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions'
import { getPeriodLabelText } from './utils'
import { ArrowLeft, ArrowRight } from 'commonComponents/Icons/index-NEW'
import { doNothing } from 'common/utils'

export type VisibleTimePeriodLabelInterface = {
  periodDurationType: PeriodDurationType,
  periodStartTimestamp: number,
  onGoBackInTime?: VoidFunction,
  onGoForwardInTime?: VoidFunction,
}

const defaultProps = {
  onGoBackInTime: doNothing,
  onGoForwardInTime: doNothing,
}

const VisibleTimePeriodLabel: React.FC<VisibleTimePeriodLabelInterface> = (props) => (
  <div className={styles.labelWrapper}>
    <ArrowLeft className={styles.arrowButton} onClick={props.onGoBackInTime} />
    <span className={styles.labelText}>{getPeriodLabelText(props.periodDurationType, props.periodStartTimestamp)}</span>
    <ArrowRight className={styles.arrowButton} onClick={props.onGoForwardInTime} />
  </div>
)

VisibleTimePeriodLabel.defaultProps = defaultProps

export default VisibleTimePeriodLabel

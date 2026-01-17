import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { useTranslation } from 'i18n'

TaskProgressEstimateNonEditable.propTypes = {
  className: PropTypes.string,
  taskProgressEstimate: PropTypes.number,
}

TaskProgressEstimateNonEditable.defaultProps = {
  taskProgressEstimate: 0,
}


function TaskProgressEstimateNonEditable(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className || styles.component}>
      <div
        className={styles.progressBar}
        style={{ transform: `scaleX(${props.taskProgressEstimate / 100})` }}
      />
      <div className={styles.progressValue}>{t(`{{progress}}% done`, { progress: props.taskProgressEstimate })}</div>
    </div>
  )
}

export default TaskProgressEstimateNonEditable

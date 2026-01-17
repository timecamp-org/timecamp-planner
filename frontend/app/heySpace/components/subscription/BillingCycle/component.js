import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import { Map } from 'immutable'
import styles from './styles.css'
import { useTranslation } from 'i18n'
import { getCostPerMonth, getCostTotal } from 'models/domain/SubscriptionModel/utils'

BillingCycle.propTypes = {
  billingPeriodId: PropTypes.string,
  billingPeriods: PropTypes.object.isRequired,
  costPerSeat: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  numberOfSeats: PropTypes.number.isRequired,

  isEditable: PropTypes.bool.isRequired,

  onChooseBillingPeriod: PropTypes.func.isRequired,
}

BillingCycle.defaultProps = {
  billingPeriods: new Map(),
  costPerSeat: '',
  currency: '',
  numberOfSeats: 0,
  isEditable: false,

  onChooseBillingPeriod: doNothing,
}

function BillingCycle(props) { // eslint-disable-line react/prefer-stateless-function
  const { t } = useTranslation()
  return (
    <div className={props.className || styles.Component}>
      {renderHeaderColumn()}
      {renderPeriodColumn()}
    </div>
  )

  function renderHeaderColumn() {
    return (
      <div className={styles.billingCycleHeaderColumn}>
        <div className={styles.cellLabel}>{t('Billed: ')}</div>
        <div className={styles.cellLabel}>{t('Cost per seat: ')}</div>
        <div className={styles.cellLabel}>{t('Price/ mo: ')}</div>
        <div className={`${styles.totalCost} ${styles.cellLabel}`}>{getTotalLabel()}</div>
      </div>
    )
  }

  function renderPeriodColumn() {
    const period = props.billingPeriods.get(props.billingPeriodId)
    return (
      <div
        className={getPeriodClassName(props.billingPeriodId)}
        onClick={props.isEditable ? props.onChooseBillingPeriod.bind(null, props.billingPeriodId) : undefined}
      >
        <div className={styles.cell}>
          {renderPeriodLabel(period)}
        </div>
        <div className={styles.cell}>
          {props.currency}{props.costPerSeat}
        </div>
        <div className={styles.cell}>
          {props.currency}{getCostPerMonth(props.billingPeriodId, props.costPerSeat, props.numberOfSeats)}
        </div>
        <div className={`${styles.totalCost} ${styles.cell}`}>
          {props.currency}{getCostTotal(props.billingPeriodId, props.costPerSeat, props.numberOfSeats)}
        </div>
      </div>
    )
  }

  function renderPeriodLabel(period) {
    return (
      <div className={styles.label}>
        <span>{t(period.label)}</span>
      </div>
    )
  }

  function getTotalLabel() {
    if (props.isConfirmationStage) {
      return t('TOTAL: ')
    }
    return t('TO PAY')
  }

  function getPeriodClassName(periodId) {
    if (props.billingPeriodId === periodId && props.isEditable) {
      return `${styles.billingCyclePeriod} ${styles.active}`
    }
    return `${styles.billingCyclePeriod} ${styles.inactive}`
  }
}


export default BillingCycle

import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import { Map } from 'immutable'
import { useTranslation } from 'i18n'
import styles from './styles.css'
import { getCostPerMonth, getCostTotal } from 'models/domain/SubscriptionModel/utils'

BillingSummary.propTypes = {
  billingPeriodId: PropTypes.string,
  billingPeriods: PropTypes.object.isRequired,
  costPerSeat: PropTypes.string.isRequired,
  subscriptionName: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  numberOfSeats: PropTypes.number.isRequired,

  onChooseBillingPeriod: PropTypes.func.isRequired,
}

BillingSummary.defaultProps = {
  billingPeriods: new Map(),
  costPerSeat: '',
  currency: '',
  subscriptionName: '',
  numberOfSeats: 0,

  onChooseBillingPeriod: doNothing,
}

function BillingSummary(props) { // eslint-disable-line react/prefer-stateless-function
  const { t } = useTranslation()
  return (
    <div className={props.className || styles.Component}>
      {renderHeaderColumn()}
      {props.billingPeriods.keySeq().map(renderPeriodColumn)}
    </div>
  )

  function renderHeaderColumn() {
    return (
      <div className={styles.billingCycleHeaderColumn}>
        <div className={styles.cellLabel}>{t('License plan:')}</div>
        <div className={styles.cellLabel}>{t('Number of seats:')}</div>
        <div className={styles.cellLabel}>{t('Billed: ')}</div>
        <div className={styles.cellLabel}>{t('Price per Month: ')}</div>
        <div className={`${styles.totalCost} ${styles.cellLabel}`}>{t('TOTAL')}</div>
      </div>
    )
  }

  function renderPeriodColumn(periodId) {
    const period = props.billingPeriods.get(periodId)
    if (props.billingPeriodId === periodId) {
      return (
        <div
          key={periodId}
          className={getPeriodClassName(periodId)}
        >
          <div className={styles.cell}>
            {props.subscriptionName}
          </div>
          <div className={styles.cell}>
            {props.numberOfSeats}
          </div>
          <div className={styles.cell}>
            {renderPeriodLabel(period)}
          </div>
          <div className={styles.cell}>
            {props.currency}{getCostPerMonth(periodId, props.costPerSeat, props.numberOfSeats)}
          </div>
          <div className={`${styles.totalCost} ${styles.cell}`}>
            {props.currency}{getCostTotal(periodId, props.costPerSeat, props.numberOfSeats)}
          </div>
        </div>
      )
    }
    return null
  }

  function renderPeriodLabel(period) {
    return (
      <div className={styles.label}>
        <span>{t(period.label)}</span>
      </div>
    )
  }

  function getPeriodClassName() {
    return `${styles.billingCyclePeriod} ${styles.inactive}`
  }
}


export default BillingSummary

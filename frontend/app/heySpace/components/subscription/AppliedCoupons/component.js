
import React from 'react'
import ImmutablePropTypes from 'immutable-prop-types'
import { List } from 'immutable'
import styles from './styles.css'
import Coupon from 'components/subscription/Coupon'

import { useTranslation } from 'i18n'

AppliedCoupons.propTypes = {
  couponIds: ImmutablePropTypes.list,
}

AppliedCoupons.defaultProps = {
  couponIds: new List(),
}

function AppliedCoupons(props) {
  const { t } = useTranslation()

  return (
    <>
      {
        props.couponIds.isEmpty()
          ? renderEmpty(t)
          : renderContent(props, t)
      }
    </>
  )

}

function renderEmpty(t) {
  return <div>{t('No coupons applied.')}</div>
}

function renderContent(props, t) {
  return (
    <>
      {renderHeader(t)}
      {props.couponIds.map(renderCoupon)}
    </>
  )
}

function renderHeader(t) {
  return (
    <div className={styles.header}>
      <div className={styles.cell}>{t('Name')}</div>
      <div className={styles.cell}>{t('Discount amount')}</div>
      <div className={styles.cell}>{t('Valid until')}</div>
      <div className={styles.cell}>{t('Code')}</div>
      <div className={styles.cell}>{t('Status')}</div>
    </div>
  )
}

function renderCoupon(couponId) {
  return (
    <Coupon
      className={styles.coupon}
      key={couponId}
      couponId={couponId}
    />
  )
}

export default AppliedCoupons

import { BillingPeriod } from '../models'
import { Map } from 'immutable'
import { i18mark } from '../../../../i18n'
import { BillingPeriodRecordInterface, BillingPeriodType } from '../types'

export const billingPeriods = Map<BillingPeriodType, BillingPeriodRecordInterface>({
  [BillingPeriodType.BILLING_PERIOD_MONTHLY]: BillingPeriod({
    id: BillingPeriodType.BILLING_PERIOD_MONTHLY,
    numberOfMonths: 1,
    label: i18mark('monthly'),
    subLabel: ' ',
    pricePer: i18mark('month'),
  }),
  [BillingPeriodType.BILLING_PERIOD_YEARLY]: BillingPeriod({
    id: BillingPeriodType.BILLING_PERIOD_YEARLY,
    numberOfMonths: 12,
    label: i18mark('yearly'),
    subLabel: ' ',
    pricePer: i18mark('year'),
  }),
})

export const billingPeriodNames: {[key: number]: string} = {
  1: i18mark('Monthly'),
  12: i18mark('Yearly'),
}

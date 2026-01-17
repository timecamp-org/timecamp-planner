import every from 'lodash/every'
import partial from 'lodash/partial'
import has from 'lodash/has'
import { timestampNow } from 'common/utils/epoch'
import { PaymentPageInterface } from '../types'
import requiredPaymentPageFields from '../constants/requiredPaymentPageFields'

export default function (paymentPage: PaymentPageInterface): boolean {
  return paymentPage
  && every(requiredPaymentPageFields, partial(has, paymentPage))
  && !isPaymentPageExpired(paymentPage)
}

function isPaymentPageExpired(paymentPage: PaymentPageInterface): boolean {
  try {
    return paymentPage.expiresAt < timestampNow() / 1000
  } catch (error) {
    return true
  }
}

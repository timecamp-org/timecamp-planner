import { PaymentPageInterface } from '../types';

const requiredFields: (keyof PaymentPageInterface)[] = [
  'id',
  'paymentUrl',
  'expiresAt',
  'seatCount',
  'planId',
  'billingPeriodId',
];

export default requiredFields;

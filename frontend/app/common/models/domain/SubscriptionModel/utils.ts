import { billingPeriods } from './constants/billingPeriods';
import { BillingPeriodType } from './types';

export function getCostPerMonth(periodType: BillingPeriodType, costPerSeat: number, numberOfSeats: number): number {
  const period = billingPeriods.get(periodType);
  return parseFloat(((costPerSeat * numberOfSeats) / period.numberOfMonths).toFixed(2));
}

export function getCostTotal(periodType: BillingPeriodType, costPerSeat: number, numberOfSeats: number): number {
  const period = billingPeriods.get(periodType);
  return parseFloat((getCostPerMonth(periodType, costPerSeat, numberOfSeats) * period.numberOfMonths).toFixed(2));
}

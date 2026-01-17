import { PlanInterface } from '../types';

export function deserializePlan(plan: PlanInterface): PlanInterface {
  return {
    ...plan,
    costPerSeat: typeof plan.costPerSeat === 'string' ? parseFloat(plan.costPerSeat) : plan.costPerSeat,
  };
}

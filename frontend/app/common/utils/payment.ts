import { capitalizeFirstLetter } from './index'

export function getCostPerSeatDiscount(costPerSeatMultiplier: number): number {
  return (1 - costPerSeatMultiplier) * 100
}

export function getStatusDisplayName(status: string): string {
  return capitalizeFirstLetter(status.toLowerCase()).replace('_', ' ')
}

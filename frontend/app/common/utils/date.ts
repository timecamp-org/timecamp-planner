
export function dateNow(): Date {
  return new Date()
}

export function timestampToDate(epoch: number): Date {
  let result = null
  const epochType = typeof epoch

  if (epochType === 'number') {
    result = new Date(epoch)
  } else {
    throw new Error(`Invalid epoch type: ${epochType}`)
  }

  return result
}

export type DateChange = {
  value: number | string | Date,
  parsedValue: number,
}

export type DateChangeHandler = (change: DateChange) => void
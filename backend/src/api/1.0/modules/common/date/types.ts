export enum DateFlavor {
  DUE_DATE_SHORT = 'dueDateShort'
}

export type DateFormatMap = {
  [format in DateFlavor] : string
}

export const DEFAULT_FORMAT : DateFormatMap = {
  [DateFlavor.DUE_DATE_SHORT]: 'MMM Do'
}

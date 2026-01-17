import { List } from 'immutable'
import { getMonthsShort } from '../../date/utils'

const months = getMonthsShort()
const monthIndexes = months.map((_, index) => index)

export const monthValues = List(months)
export const monthKeys = List(monthIndexes)

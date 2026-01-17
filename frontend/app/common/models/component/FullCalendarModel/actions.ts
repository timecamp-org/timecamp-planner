import * as C from './constants'
import { action } from 'typesafe-actions'
import { Id } from '../../../utils/identifier';
import { DateRange } from './types';
import { Map } from 'immutable';
import { Views } from 'react-big-calendar'

export const onSetDateRange = (objectId: Id, dateRange: DateRange) =>
  action(C.onSetDateRange, { objectId, dateRange: Map(dateRange) })

export const onUnsetDateRange = (objectId: Id) =>
  action(C.onUnsetDateRange, { objectId })

export const onSetCurrentView = (objectId: Id, currentView: Views) =>
  action(C.onSetCurrentView, { objectId, currentView })

export const onSetCurrentDate = (objectId: Id, currentDate: Date, offset: number = C.DEFAULT_OFFSET) =>
  action(C.onSetCurrentDate, { objectId, currentDate, offset })

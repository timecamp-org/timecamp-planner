import { Record } from 'immutable'

import * as kinds from './constants/kinds'
import { close } from './constants/actionsTypes'

export const Alert = new Record({
  id: 0,
  text: '[human readable text not set]',
  kind: kinds.notSet,
  links: [],
  isSelfDisposable: true,
  actions: [close],
  leftIcon: null,
})

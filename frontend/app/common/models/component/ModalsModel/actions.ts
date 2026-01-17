import * as C from './constants'
import { action } from 'typesafe-actions'
import { AnyDict } from 'common/types'
import { ModalType } from './types'
import { Map } from 'immutable'

export const onOpenModal = (modalType: ModalType, data?: AnyDict) =>
  action(C.onOpenModal, { modalType, data: Map(data) })

export const onCloseModal = (modalType: ModalType) =>
  action(C.onCloseModal, { modalType })

export const onSetDidUserCloseModalUltimately = (modalType: ModalType, didUserClose: boolean) =>
  action(C.onSetDidUserCloseModalUltimately, { modalType, didUserClose })

export const onGetDidUserCloseModalUltimately = (modalType: ModalType) =>
  action(C.onGetDidUserCloseModalUltimately, { modalType })

export const onSaveDidUserCloseModalUltimately = (modalType: ModalType, didUserClose: boolean) =>
  action(C.onSaveDidUserCloseModalUltimately, { modalType, didUserClose })

import React from 'react'
import SpaceGroupsModalContent from 'commonComponents/modals/SpaceGroupsModalContent'
import Version2410ModalContent from 'commonComponents/modals/Version2410ModalContent'
import Version2430ModalContent from 'commonComponents/modals/Version2430ModalContent'
import { Map } from 'immutable'
import Version2490ModalContent from '../modals/Version2490ModalContent'
import { i18n } from 'i18n'
import Version2500ModalContent from '../modals/Version2500ModalContent'

type ClientNewVersionModalConfig = Map<string, NewClientVersionModalInterface>

type NewClientVersionModalInterface = {
  title: string,
  saveButtonCaption: string,
  content: React.ReactElement,
}

export const modalConfig: ClientNewVersionModalConfig = Map({
  '2.39.0': {
    title: i18n.t('Hey!'),
    saveButtonCaption: 'Ok',
    content: <SpaceGroupsModalContent />,
  },
  '2.41.0': {
    title: i18n.t('Hey!'),
    saveButtonCaption: 'Ok',
    content: <Version2410ModalContent />,
  },
  '2.43.0': {
    title: i18n.t('Hey!'),
    saveButtonCaption: 'Ok',
    content: <Version2430ModalContent />,
  },
  '2.49.0': {
    title: i18n.t('Hey!'),
    saveButtonCaption: 'Ok',
    content: <Version2490ModalContent />,
  },
  '2.50.0': {
    title: i18n.t('Hey!'),
    saveButtonCaption: 'Ok',
    content: <Version2500ModalContent />,
  },
})

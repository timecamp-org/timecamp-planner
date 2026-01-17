import { modalConfig } from 'commonComponents/ClientNewVersionModalWrapper/config'
import OneTimeUserDisposableModal from 'commonComponents/OneTimeUserDisposableModal'
import { ModalType } from 'models/component/ModalsModel/types'
import React from 'react'
import { useTranslation } from 'i18n'

export const ClientNewVersionModalWrapper: React.FC = () => {
  const currentVersion = process.env.VERSION
  const modal = modalConfig.get(currentVersion)
  const { t } = useTranslation()

  if (!modal) {
    return null
  }

  return (
    <OneTimeUserDisposableModal
      modalType={generateModalTypeByVersion(currentVersion)}
      title={t(modal.title)}
      saveButtonCaption={t(modal.saveButtonCaption)}
      content={modal.content}
    />
  )
}

export function generateModalTypeByVersion(appVersion: string): ModalType {
  return `${ModalType.CLIENT_NEW_VERSION_MODAL}::${appVersion}` as ModalType
}
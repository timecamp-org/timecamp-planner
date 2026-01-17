import React, { FC } from 'react'
import UniversalModal from 'commonComponents/UniversalModal'
import { ModalType } from 'models/component/ModalsModel/types'
import { useComponent } from './hook'
import { i18n } from 'i18n'
import styles from './styles.css'
import { doNothing } from 'common/utils'

export type OneTimeUserDisposableModalInterface = {
  modalType: ModalType,
  title: string,
  content: string | JSX.Element,
  saveButtonCaption?: string,
}

const defaultProps: Partial<OneTimeUserDisposableModalInterface> = {
  saveButtonCaption: i18n.t('I understand'),
}

const OneTimeUserDisposableModal: FC<OneTimeUserDisposableModalInterface> = (props) => {
  const hook = useComponent(props)
  if (!hook.isModalOpen) {
    return null
  }
  return (
    <UniversalModal
      innerModalDialogClassName={styles.innerModalDialogClassName}
      isModalOpen={hook.isModalOpen}
      shouldRenderCloseIcon={false}
      shouldRenderCancelButton={false}
      saveButtonCaption={props.saveButtonCaption}
      header={props.title}
      onSetIsModalOpen={doNothing}
      onModalSave={hook.onCloseModal}
    >
      {props.content}
    </UniversalModal>
  )
}

OneTimeUserDisposableModal.defaultProps = defaultProps

export default OneTimeUserDisposableModal

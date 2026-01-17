import React, { FC } from 'react'
import UniversalModal from 'commonComponents/UniversalModal'
import JitsiMeet from '../JitsiMeet'
import styles from './styles.css'
import useComponent, { MeetModalHookInterface } from './hook'
import SecondaryButton from 'components/buttons/SecondaryButton'
import { Maximize, Minimize, Delete } from 'commonComponents/Icons'

const MeetModal: FC = () => {
  const hook = useComponent()
  const {
    color,
    isMinimized,
    objectId,
    onSetIsMinimized,
    onSetIsOpen,
  } = hook

  return (
    <UniversalModal
      isModalOpen={true}
      shouldRenderFooter={false}
      shouldRenderCancelButton={false}
      shouldRenderMinimizeIcon={true}
      shouldRenderSaveButton={false}
      shouldCloseOnBackdropClick={false}
      color={color}
      isMinimized={isMinimized}
      header={renderHeader(hook)}
      customWindowControls={renderWindowControls(hook)}
      modalBodyClassName={styles.modalBody}
      innerModalDialogClassName={styles.modalDialog}
      headerClassName={styles.modalHeader}
      onSetIsModalOpen={onSetIsOpen}
      onSetIsMinimized={onSetIsMinimized}
    >
      <div className={isMinimized ? styles.miminizedWrapper : styles.wrapper}>
        <JitsiMeet
          objectId={objectId}
        />
      </div>
    </UniversalModal>
  )
}

function renderHeader(hook: MeetModalHookInterface) {
  return (
    <div className={hook.isMinimized ? styles.minimizedHeader : styles.headerInner}>
      {hook.containerName}
    </div>
  )
}

function renderWindowControls(hook: MeetModalHookInterface) {
  return (
    <>
      {
        renderMinimizeMaximizeButton(hook)
      }
      {
        renderCloseIcon(hook)
      }
    </>
  )
}

const renderMinimizeMaximizeButton = (hook: MeetModalHookInterface) => {
  if (hook.isMinimized) {
    return (
      <SecondaryButton
        className={styles.windowControlButton}
        onClick={hook.onMaximize}
        color={hook.color}
      >
        <Maximize height={16} />
      </SecondaryButton>
    )
  } else {
    return (
      <SecondaryButton
        className={styles.windowControlButton}
        onClick={hook.onMinimize}
        color={hook.color}
      >
        <Minimize height={16} />
      </SecondaryButton>
    )
  }
}

const renderCloseIcon = (hook: MeetModalHookInterface) => (
  <SecondaryButton
    className={styles.closeButton}
    onClick={hook.onSendCloseModalSignal}
    color={hook.color}>
    <Delete
      width={16}
    />
  </SecondaryButton>
)


export default MeetModal

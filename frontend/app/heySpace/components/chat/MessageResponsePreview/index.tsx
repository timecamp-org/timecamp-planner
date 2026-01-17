import React, { memo } from 'react'
import { Id } from 'common/utils/identifier'
import MessageFresh from '../Message/MessageFresh'
import useComponent from './hook'
import styles from './styles.css'
import SecondaryButton from '../../buttons/SecondaryButton'
import { X as XIcon } from 'commonComponents/Icons'
import commonStyles from 'styles/common.css'

type MessageResponsePreviewInterface = {
  messageId: Id,
}

const MessageResponsePreview: React.FC<MessageResponsePreviewInterface> = ({ messageId }) => {
  const hook = useComponent(messageId)
  return (
    <div className={styles.response}>
      <MessageFresh
        messageId={messageId}
        objectId={hook.objectId}
      />
      <SecondaryButton
        className={styles.closeButton}
        onClick={hook.onStopResponse}
      >
        <XIcon width={commonStyles.defaultIconWidth} />
      </SecondaryButton>
    </div>
  )
}

export default memo(MessageResponsePreview)

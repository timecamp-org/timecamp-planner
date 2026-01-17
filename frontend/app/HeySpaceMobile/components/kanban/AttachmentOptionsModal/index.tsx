import React from 'react'
import UniversalModal from 'commonComponents/UniversalModal'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import styles from './styles'
import ArrowDown from 'Icons/ArrowDown'
import Trash from 'Icons/Trash'
import { blueGreyColor, coralPinkTwoColor } from 'common/commonStyles/colors'
import { Id } from '../../../../common/utils/identifier'
import { useComponent } from './hook'

export interface AttachmentOptionsModalInterface {
  attachmentId: Id,
  isOpen: boolean,
  onClose: VoidFunction

  onShowDeleteConfirmationModal: VoidFunction
}

export const AttachmentOptionsModal: React.FC<AttachmentOptionsModalInterface> = (
  props: AttachmentOptionsModalInterface
): React.ReactElement => {

  const hook = useComponent(props)

  return (
    <UniversalModal
      isVisible={props.isOpen}
      onBackdropPress={props.onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalPadding}>
          <TouchableOpacity onPress={hook.onDownloadFile}>
            <View style={styles.button}>
              <ArrowDown style={styles.icon} color={blueGreyColor} />
              <Text style={styles.buttonText}>{'Download file'}</Text>
            </View>
          </TouchableOpacity>
          { hook.canUserDeleteAttachment &&
            renderDeleteAttachmentOption(hook.onShowDeleteConfirmationModal)
          }
        </View>
      </View>
    </UniversalModal>
  )
}

const renderDeleteAttachmentOption = (
  onShowDeleteConfirmationModal: VoidFunction
): React.ReactElement => (
  <TouchableOpacity
    onPress={onShowDeleteConfirmationModal}
  >
    <View style={styles.button}>
      <Trash style={styles.icon} color={coralPinkTwoColor} />
      <Text
        style={StyleSheet.flatten([
          styles.buttonText,
          styles.deleteButtonText
        ])}
      >
        {'Delete this attachment'}
      </Text>
    </View>
  </TouchableOpacity>
)

export default AttachmentOptionsModal
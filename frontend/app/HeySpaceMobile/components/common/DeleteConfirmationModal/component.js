import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

DeleteConfirmationModalContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
  deleteButtonText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

DeleteConfirmationModalContent.defaultProps = {
  cancelButtonText: 'CANCEL',
  deleteButtonText: 'DELETE',
}

export function DeleteConfirmationModalContent(props) {
  return (
    <React.Fragment>
      <View style={styles.modalContainer}>
        <View style={styles.modalPadding}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.description}>{props.description}</Text>
        </View>
        <View style={styles.bottomButtonsWrapper}>
          <TouchableOpacity onPress={props.onClose}>
            <Text style={styles.deleteConfirmationButtonText}>{props.cancelButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onDelete}>
            <Text style={StyleSheet.flatten([styles.deleteConfirmationButtonText, styles.deleteButtonText])}>{props.deleteButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  )
}

DeleteConfirmationModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
  deleteButtonText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

DeleteConfirmationModal.defaultProps = {
  cancelButtonText: 'CANCEL',
  deleteButtonText: 'DELETE',
}

export default function DeleteConfirmationModal(props) {
  return (
    <UniversalModal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
    >
      <DeleteConfirmationModalContent {...props} />
    </UniversalModal>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import styles from './styles'
import { doNothing } from 'common/utils';

DeactivateUserConfirmationModal.propTypes = {
  userId: PropTypes.string,
  isVisible: PropTypes.bool,
  onDeactivateUser: PropTypes.func,
  onClose: PropTypes.func,
}

DeactivateUserConfirmationModal.defaultProps = {
  isVisible: false,
  onDeactivateUser: doNothing,
  onClose: doNothing,
}

export default function DeactivateUserConfirmationModal(props) {
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header} numberOfLines={1}>
          {'Deactivate user'}
        </Text>
        <Text style={styles.subtitle}>
          {'User won\'t have access to this workspace anymore'}
        </Text>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onClose} style={StyleSheet.flatten([styles.footerButton, styles.leftButton])}>
            <Text
              style={{
                ...styles.footerButtonText,
              }}
            >
              {'Cancel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onDeactivateUser} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                ...styles.rightFooterButtonText,
              }}
            >
              {'Deactivate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  )

}

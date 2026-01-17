import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import styles from './styles'
import { doNothing } from 'common/utils';

TransferOwnershipModal.propTypes = {
  userName: PropTypes.string.isRequired,
  workspaceName: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  onTransferOwnership: PropTypes.func,
  onClose: PropTypes.func,
}

TransferOwnershipModal.defaultProps = {
  isVisible: false,
  onTransferOwnership: doNothing,
  onClose: doNothing,
}

export default function TransferOwnershipModal(props) {
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header} numberOfLines={1}>
          {'Transfer ownership'}
        </Text>
        <Text style={styles.subtitle}>
          {`Make ${props.userName} the owner of this workspace (${props.workspaceName})`}
        </Text>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onClose} style={StyleSheet.flatten([styles.footerButton, styles.leftButton])}>
            <Text style={styles.footerButtonText}>
              {'Cancel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onTransferOwnership} style={styles.footerButton}>
            <Text style={StyleSheet.flatten([styles.footerButtonText, styles.rightFooterButtonText])}>
              {'Transfer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  )

}

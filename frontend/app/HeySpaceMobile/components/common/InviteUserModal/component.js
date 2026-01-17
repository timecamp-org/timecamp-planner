import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'
import X from '../../Icons/X'
import PrimaryButton from 'commonComponents/PrimaryButton'
import { cloudyBlueColor, whiteTwoColor } from 'common/commonStyles/colors'

InviteUserModal.propTypes = {
  isVisible: PropTypes.bool,
  inputValue: PropTypes.string,
  isValid: PropTypes.bool,
  validationMessage: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChangeInputValue: PropTypes.func.isRequired,
  onInvite: PropTypes.func.isRequired,
}

InviteUserModal.defaultProps = {
  isVisible: false,
  inputValue: '',
  isValid: false,
}

function InviteUserModal(props) {
  return (
    <UniversalModal
      style={styles.modal}
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      backdropOpacity={1}
      backdropColor={whiteTwoColor}
      onModalHide={props.onModalHide}
    >
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.top}>
          <Text style={styles.title}>{'Invite user'}</Text>
          <TouchableOpacity style={styles.closeIcon} onPress={props.onClose}>
            <X color={cloudyBlueColor} />
          </TouchableOpacity>
        </View>
        <TextInput
          autoFocus
          style={styles.input}
          keyboardType={'email-address'}
          value={props.inputValue}
          onChangeText={props.onChangeInputValue}
        />
        <View style={styles.infoContainer}>
          <Text style={props.isValid ? styles.successInfo : styles.errorInfo}>{props.validationMessage}</Text>
        </View>
        <PrimaryButton
          style={styles.button}
          text={'Invite'}
          onPress={props.onInvite}
        />
      </SafeAreaView>
    </UniversalModal>
  )
}

export default InviteUserModal

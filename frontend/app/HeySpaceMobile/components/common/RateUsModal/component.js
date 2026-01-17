import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'

import { View, Text, Image, TouchableOpacity } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import SendIcon from '../../Icons/Send'

import Assets from 'common/commonAssets'

RateUsModal.propTypes = {
  isVisible: PropTypes.bool,

  onClose: PropTypes.func,
  onModalHide: PropTypes.func,
  onRate: PropTypes.func,
  onSendFeedback: PropTypes.func,
}

RateUsModal.defaultProps = {
  isVisible: false,

  onClose: doNothing,
  onModalHide: doNothing,
  onRate: doNothing,
  onSendFeedback: doNothing,
}

function RateUsModal(props) {
  return (
    <UniversalModal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      onModalHide={props.onModalHide}
    >
      <View style={styles.modalContent}>
        <Text style={styles.header}>
          {'Loving this App?'}
        </Text>
        <Text style={styles.text}>
          {'Or maybe have some thoughts to share?'}
        </Text>
        <Image
          style={styles.mascot}
          source={{ uri: Assets.CHARACTER_8 }}
          resizeMode={'contain'}
        />
        <View style={styles.buttons}>
          <View style={styles.primaryButtons}>
            {renderSendFeedbackButton(props)}
            {renderRateUsButton(props)}
          </View>
          {renderRemindMeLaterButton(props)}
        </View>
      </View>
    </UniversalModal>
  )
}

function renderSendFeedbackButton(props) {
  return (
    <TouchableOpacity
      style={{ ...styles.button, ...styles.tellUsButton }}
      onPress={props.onSendFeedback}
    >
      <Text style={styles.buttonText}>
        {'Tell us!'}
      </Text>
      <SendIcon style={styles.buttonIcon} strokeWidth={2} />
    </TouchableOpacity>
  )
}

function renderRateUsButton(props) {
  return (
    <TouchableOpacity
      style={{ ...styles.button, ...styles.rateUsButton }}
      onPress={props.onRate}
    >
      <Text style={styles.buttonText}>
        {'Rate us!'}
      </Text>
      <Image
        style={styles.buttonIcon}
        source={{ uri: Assets.GOOGLE_PLAY }}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  )
}

function renderRemindMeLaterButton(props) {
  return (
    <TouchableOpacity
      style={styles.remindLateButton}
      onPress={props.onClose}
    >
      <Text style={styles.remindLateButtonText}>
        {'Remind me later'}
      </Text>
    </TouchableOpacity>
  )
}

export default RateUsModal

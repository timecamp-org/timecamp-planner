import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'

import Modal from 'react-native-modal'
import PopUpAlertsController from 'commonComponents/PopUpAlertsController'
import styles from './styles'


UniversalModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
}

UniversalModal.defaultProps = {
  isVisible: false,
  style: {},
}

function UniversalModal(props) {
  return (
    <Modal
      {...props}
      style={StyleSheet.flatten([styles.Component, props.style])}
    >
      {props.children}
      <PopUpAlertsController />
    </Modal>
  )
}

export default UniversalModal

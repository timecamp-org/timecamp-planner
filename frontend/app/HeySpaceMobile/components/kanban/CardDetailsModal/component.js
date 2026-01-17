import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import CardDetails from '../../kanban/CardDetails'
import ArrowLeft from 'Icons/ArrowLeft'

import styles from './styles'
import { whiteTwoColor } from 'common/commonStyles/colors';

CardDetailsModal.propTypes = {
  taskId: PropTypes.string.isRequired,
}

CardDetailsModal.defaultProps = {

}

export default function CardDetailsModal(props) {
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
    >
      <View style={styles.component}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowLeftButton}
            onPress={props.onClickClose}
          >
            <ArrowLeft
              svgProps={{ style: styles.arrowLeftIcon }}
              currentColor={whiteTwoColor}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <CardDetails taskId={props.taskId} />
        </View>
      </View>
    </UniversalModal>
  )

}

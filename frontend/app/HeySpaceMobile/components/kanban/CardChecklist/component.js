import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text, StyleSheet } from 'react-native'
import ChecklistItem from '../checklist/ChecklistItem'
import Checklist from 'Icons/Checklist'
import SecondaryButton from 'commonComponents/SecondaryButton'
import AddChecklistItemModal from '../checklist/AddChecklistItemModal'
import { cloudyBlueColor } from 'common/commonStyles/colors'

CardChecklist.propTypes = {
  taskId: PropTypes.string.isRequired,
  checklistItemIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  isAddChecklistItemModalVisible: PropTypes.bool.isRequired,
  onSetIsAddChecklistItemModalVisible: PropTypes.func.isRequired,
}

function CardChecklist(props) {
  return (
    <View style={StyleSheet.flatten([styles.container, props.style])}>
      <View style={styles.sectionTitle}>
        <Checklist style={styles.icon} color={cloudyBlueColor} />
        <Text style={styles.sectionTitleText}>{'Checklist'}</Text>
      </View>
      <View style={styles.listWithButton}>
        {props.checklistItemIds.map(renderChecklistItem)}
        <SecondaryButton
          text={'ADD ITEM TO LIST'}
          style={styles.addItemButton}
          onPress={() => props.onSetIsAddChecklistItemModalVisible(true)}
        />
      </View>
      <AddChecklistItemModal
        taskId={props.taskId}
        isVisible={props.isAddChecklistItemModalVisible}
        onClose={() => props.onSetIsAddChecklistItemModalVisible(false)}
      />
    </View>
  )

  function renderChecklistItem(checklistItemId) {
    return <ChecklistItem key={checklistItemId} taskId={props.taskId} checklistItemId={checklistItemId} />
  }
}

export default CardChecklist

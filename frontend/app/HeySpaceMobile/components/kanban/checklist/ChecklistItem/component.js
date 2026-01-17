import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { cloudyBlueColor } from 'common/commonStyles/colors'
import { doNothing } from 'common/utils'

import { View, TextInput, TouchableOpacity } from 'react-native'
import CustomCheckbox from 'commonComponents/CustomCheckbox'
import Trash from 'Icons/Trash'
import DeleteConfirmationModal from 'commonComponents/DeleteConfirmationModal'

ChecklistItem.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  isConfirmDeleteModalOpen: PropTypes.bool.isRequired,
  isInputFocused: PropTypes.bool.isRequired,
  taskColor: PropTypes.string,

  onSetIsConfirmDeleteModalOpen: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onRemoveItemFromChecklist: PropTypes.func.isRequired,
  onBlurChecklistItemTextInput: PropTypes.func.isRequired,
  onFocusChecklistItemTextInput: PropTypes.func.isRequired,
}

ChecklistItem.defaultProps = {
  isChecked: false,
  text: '',
  isConfirmDeleteModalOpen: false,
  isInputFocused: false,

  onSetIsConfirmDeleteModalOpen: doNothing,
  onToggleStatus: doNothing,
  onChangeText: doNothing,
  onRemoveItemFromChecklist: doNothing,
  onBlurChecklistItemTextInput: doNothing,
  onFocusChecklistItemTextInput: doNothing,
}

function ChecklistItem(props) {
  return (
    <View style={styles.container}>
      <CustomCheckbox style={styles.checkbox} color={props.taskColor} isChecked={props.isChecked} onPress={props.onToggleStatus} />
      <TextInput
        style={props.isInputFocused ? styles.nameInputFocused : styles.nameInput}
        value={props.text}
        multiline
        onChangeText={props.onChangeText}
        onFocus={props.onFocusChecklistItemTextInput}
        onBlur={props.onBlurChecklistItemTextInput}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={() => props.onSetIsConfirmDeleteModalOpen(true)}>
        <Trash style={styles.icon} color={cloudyBlueColor} />
      </TouchableOpacity>
      <DeleteConfirmationModal
        isVisible={props.isConfirmDeleteModalOpen}
        title={'Delete checklist item'}
        description={'Are you sure you want to delete this checklist item? This cannot be undone.'}
        onClose={() => props.onSetIsConfirmDeleteModalOpen(false)}
        onDelete={props.onRemoveItemFromChecklist}
      />
    </View>
  )
}

export default ChecklistItem

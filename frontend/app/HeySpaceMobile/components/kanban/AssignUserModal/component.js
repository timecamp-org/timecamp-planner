import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { View, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import ArrowLeft from 'Icons/ArrowLeft'
import PersonIcon from '../../person/PersonIcon'
import PersonFullName from '../../person/PersonFullName'
import Delete from 'Icons/Delete'

import styles from './styles'
import { whiteTwoColor } from 'common/commonStyles/colors';

AssignUserModal.propTypes = {
  value: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  taskColor: PropTypes.string.isRequired,
  userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  assigneeIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,

  setTextInputRef: PropTypes.func.isRequired,
  blurTextInput: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onClickClose: PropTypes.func.isRequired,
  onAssignUserToTask: PropTypes.func.isRequired,
  onRemoveUserFromTask: PropTypes.func.isRequired,
}

AssignUserModal.defaultProps = {

}

export default function AssignUserModal(props) {
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
          <TextInput
            ref={props.setTextInputRef}
            style={styles.input}
            value={props.value}
            onChangeText={props.onChangeText}
            underlineColorAndroid={props.taskColor}
            autoFocus
          />
          {
            props.value !== ''
            ? renderUserList()
            : renderAssignee()
          }
        </View>
      </View>
    </UniversalModal>
  )

  function renderAssignee() {
    return (
      <ScrollView
        style={styles.assigneeList}
        keyboardShouldPersistTaps={'always'}
        onScrollBeginDrag={props.blurTextInput}
      >
        {
          props.assigneeIds.map((userId) => (
            <View style={styles.userRow} key={userId}>
              {renderUserRow(userId)}
              <TouchableOpacity
                style={styles.deleteIconWrapper}
                onPress={() => props.onRemoveUserFromTask(userId)}
              >
                <Delete
                  svgProps={{ style: styles.deleteIcon }}
                  currentColor={props.taskColor}
                />
              </TouchableOpacity>
            </View>
          ))
        }
      </ScrollView>
    )
  }

  function renderUserList() {
    return (
      <ScrollView
        style={styles.userList}
        keyboardShouldPersistTaps={'always'}
        onScrollBeginDrag={props.blurTextInput}
      >
        {
          props.userIds.map((userId) => (
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => props.onAssignUserToTask(userId)}
              key={userId}
            >
              {renderUserRow(userId)}
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    )
  }

  function renderUserRow(userId) {
    return (
      <View style={styles.userRow}>
        <PersonIcon userId={userId} style={styles.personIcon}/>
        <PersonFullName userId={userId} style={styles.personFullName}/>
      </View>      
    )
  }

}

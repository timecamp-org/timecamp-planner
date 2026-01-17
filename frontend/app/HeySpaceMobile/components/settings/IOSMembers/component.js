import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { doNothing } from 'common/utils'

import { ScrollView, Text, StyleSheet, View } from 'react-native'
import IOSSettingsItem from "components/settings/IOSSettingsItem"
import PersonIcon from "components/person/PersonIcon"
import PersonFullName from "components/person/PersonFullName"
import IOSSettingsButtonRightLink from "components/settings/IOSSettingsButtonRightLink"
import IOSSettingsDivider from "components/settings/IOSSettingsDivider"
import ActionSheet from "components/kanban/ActionSheet"
import DeactivateUserConfirmationModal from "commonComponents/DeactivateUserConfirmationModal"
import TransferOwnershipModal from "commonComponents/TransferOwnershipModal"

IOSMembers.propTypes = {
  isActionSheetOpen: PropTypes.bool,
  selectedUserId: PropTypes.string,
  isUserDeactivationConfirmationModalOpen: PropTypes.bool,
  emptyUserListMessage: PropTypes.string,
  userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  userNamesByIds: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,
  listOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  destructiveOptions: PropTypes.arrayOf(PropTypes.string),
  areItemsClickable: PropTypes.bool,
  onItemPress: PropTypes.func,
  onOptionSelect: PropTypes.func,
  onCloseUserDeactivationConfirmationModal: PropTypes.func,
}

IOSMembers.defaltProps = {
  destructiveOptions: [],
  emptyUserListMessage: 'No users',
  areItemsClickable: false,
  onItemPress: doNothing,
  onOptionSelect: doNothing,
  onCloseUserDeactivationConfirmationModal: doNothing,
}

function IOSMembers(props) {
  function renderOption(option) {
    const isDestructiveOption = props.destructiveOptions.includes(option)
    return <Text style={StyleSheet.flatten([styles.option, isDestructiveOption ? styles.optionDestructive : null])}>{option}</Text>
  }

  function renderUserItem(userId) {
    return (
      <React.Fragment key={userId}>
        <IOSSettingsItem
          renderTitle={() => (
            <View style={styles.userRow}>
              <PersonIcon userId={userId} style={styles.personIcon}/>
              <PersonFullName
                style={styles.personFullName}
                userId={userId}
                shouldAddYouInParenthesesIfCurrent
              />
            </View>
          )}
          right={props.areItemsClickable ? <IOSSettingsButtonRightLink /> : null}
          onPress={props.areItemsClickable ? () => props.onItemPress(userId) : doNothing}
        />
        <IOSSettingsDivider fullWidth />
      </React.Fragment>
    )
  }

  return (
    <ScrollView style={styles.container}>

      {props.userIds.size > 0
        ? <IOSSettingsDivider fullWidth />
        : <Text style={styles.emptyUserListMessage}>{props.emptyUserListMessage}</Text>
      }
      {props.userIds.map(renderUserItem)}

      <ActionSheet
        title={props.userNamesByIds.get(props.selectedUserId)}
        isVisible={props.isActionSheetOpen}
        options={props.listOptions.map(renderOption)}
        onClose={props.onCloseActionSheet}
        onSelectOption={props.onOptionSelect}
      />

      <DeactivateUserConfirmationModal
        isVisible={props.isUserDeactivationConfirmationModalOpen}
        userId={props.selectedUserId}
        onClose={props.onCloseUserDeactivationConfirmationModal}
      />

      <TransferOwnershipModal
        isVisible={props.isTransferOwnershipModalOpen}
        userId={props.selectedUserId}
        onClose={props.onCloseTransferOwnershipModal}
      />

    </ScrollView>
  )
}

export default IOSMembers

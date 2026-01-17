import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { doNothing } from 'common/utils'

import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import PersonIcon from 'components/person/PersonIcon'
import PersonFullName from "components/person/PersonFullName"
import PersonEmail from "components/person/PersonEmail"
import PrimaryButton from 'commonComponents/PrimaryButton'
import Toast from 'react-native-easy-toast'
import ChevronUp from 'components/Icons/ChevronUp'
import ChevronDown from 'components/Icons/ChevronDown'


TeamMembersManagement.propTypes = {
  userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  inviteInputValue: PropTypes.string.isRequired,
  isInviteInputValid: PropTypes.bool.isRequired,
  isDisabledUsersVisible: PropTypes.bool.isRequired,
  isCurrentUserOrganizationAdmin: PropTypes.bool,

  onChangeInviteInput: PropTypes.func.isRequired,
  onPressInviteButton: PropTypes.func.isRequired,
  onSetInviteInput: PropTypes.func.isRequired,
  onBlurInviteInput: PropTypes.func.isRequired,
  onSetToastRef: PropTypes.func.isRequired,
  onDisabledUsersSwitcherClick: PropTypes.func.isRequired,
}

TeamMembersManagement.defaultProps = {
  isDisabledUsersVisible: false,
  isCurrentUserOrganizationAdmin: false,

  onChangeInviteInput: doNothing,
  onPressInviteButton: doNothing,
  onSetInviteInput: doNothing,
  onBlurInviteInput: doNothing,
  onSetToastRef: doNothing,
  onDisabledUsersSwitcherClick: doNothing,
}

function TeamMembersManagement(props) {
  const shouldRenderDisabledUsersSwitcher = props.isCurrentUserOrganizationAdmin && !props.deactivatedUserIds.isEmpty()
  const shouldRenderDisabledUsers = props.isCurrentUserOrganizationAdmin && props.isDisabledUsersVisible

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{'Invite or manage team members'}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={props.onSetInviteInput}
            style={StyleSheet.flatten([styles.input, props.isInviteInputValid ? {} : styles.inputInvalid])}
            value={props.inviteInputValue}
            onChangeText={props.onChangeInviteInput}
          />
          <PrimaryButton
            style={styles.inviteButton}
            text={'Invite'}
            onPress={props.onPressInviteButton}
          />
        </View>
        <ScrollView style={styles.userList}>
          {renderActiveMembers()}
          {shouldRenderDisabledUsersSwitcher
            ? renderDisabledUsersSwitcher()
            : null
          }
          {shouldRenderDisabledUsers
            ? renderDisabledMembers()
            : null
          }
        </ScrollView>
      </View>
      <Toast
        ref={props.onSetToastRef}
        fadeInDuration={0}
        position={'top'}
      />
    </View>
  )

  function renderActiveMembers() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        onScrollBeginDrag={props.onBlurInviteInput}
      >
        {props.userIds.map(renderMember)}
      </ScrollView>
    )
  }

  function renderDisabledMembers() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        onScrollBeginDrag={props.onBlurInviteInput}
      >
        {props.deactivatedUserIds.map(renderMember)}
      </ScrollView>
    )
  }


  function renderDisabledUsersSwitcher() {
    return (
      <TouchableOpacity
        style={styles.disabledUsersSwitcher}
        onPress={props.onDisabledUsersSwitcherClick}
      >
        <Text style={styles.disabledUsersText}>{'Disabled users'}</Text>
        {
          props.isDisabledUsersVisible
            ? <ChevronUp style={styles.chevronIcon} />
            : <ChevronDown style={styles.chevronIcon} />
        }
      </TouchableOpacity>
    )
  }

  function renderMember(userId) {
    const isUserDeactivated = props.deactivatedUserIds.includes(userId)
    return (
      <View key={userId} style={styles.userLabel}>
        <PersonIcon userId={userId} />
        <View style={styles.userLabelRight}>
          <PersonFullName userId={userId} shouldRenderInvitationPendingStatus={true} />
          <PersonEmail userId={userId} style={isUserDeactivated ? styles.deactivated : null} />
        </View>
      </View>
    )
  }
}

export default TeamMembersManagement

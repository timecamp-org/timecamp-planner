import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { doNothing } from 'common/utils'

import { ScrollView, Text, View } from 'react-native'
import IOSSettingsButtonRightLink from '../../settings/IOSSettingsButtonRightLink'
import IOSSettingsTextInput from '../../settings/IOSSettingsTextInput'
import IOSSettingsItem from '../../settings/IOSSettingsItem'
import IOSSettingsDivider from '../../settings/IOSSettingsDivider'
import IOSSettingsSectionDivider from '../../settings/IOSSettingsSectionDivider'
import PersonIcon from '../../person/PersonIcon'
import PersonFullName from '../../person/PersonFullName'

AddSpaceMembersScreen.propTypes = {
  inputValue: PropTypes.string,
  emptyUserListMessage: PropTypes.string,
  emptyUserSearchListMessage: PropTypes.string,
  userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  onChangeText: PropTypes.func,
  onItemPress: PropTypes.func,
}

AddSpaceMembersScreen.defaultProps = {
  inputValue: '',
  emptyUserListMessage: 'No users',
  emptyUserSearchListMessage: 'No users matching search phrase',
  onChangeText: doNothing,
  onItemPress: doNothing,
}

function AddSpaceMembersScreen(props) {
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
          onPress={() => props.onItemPress(userId)}
          right={<IOSSettingsButtonRightLink />}
        />
        <IOSSettingsDivider fullWidth />
      </React.Fragment>
    )
  }

  return (
    <ScrollView style={styles.container}>

      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        autoFocus
        placeholder={'Type an email address or a name'}
        value={props.inputValue}
        onChangeText={props.onChangeText}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={null} />

      {props.userIds.size > 0
        ? <IOSSettingsDivider fullWidth />
        : <Text style={styles.emptyUserListMessage}>{props.inputValue.length > 0 ? props.emptyUserSearchListMessage : props.emptyUserListMessage}</Text>
      }
      {props.userIds.map(renderUserItem)}
    </ScrollView>
  )
}

export default AddSpaceMembersScreen

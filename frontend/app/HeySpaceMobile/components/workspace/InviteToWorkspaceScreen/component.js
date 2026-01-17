import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'

import Assets from 'common/commonAssets'
import { View, Image, Text } from 'react-native'
import IOSSettingsTextInput from 'components/settings/IOSSettingsTextInput'
import IOSSettingsDivider from 'components/settings/IOSSettingsDivider'

InviteToWorkspaceScreen.propTypes = {
  inputValue: PropTypes.string,
  validationMessage: PropTypes.string,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
}

InviteToWorkspaceScreen.defaultProps = {
  onBlur: doNothing,
  onChangeText: doNothing,
}

function InviteToWorkspaceScreen(props) {
  return (
    <View style={styles.container}>

      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        autoFocus
        placeholder={'Type an email address to invite'}
        value={props.inputValue}
        validationMessage={props.validationMessage}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
      />
      <IOSSettingsDivider fullWidth />

      <Image source={{ uri: Assets.CHARACTER_24 }} style={styles.image} />
      <Text style={styles.text}>{'Sharing is caring!'}</Text>

    </View>
  )
}

export default InviteToWorkspaceScreen

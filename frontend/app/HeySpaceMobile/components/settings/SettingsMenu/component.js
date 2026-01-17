import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { blueGreyColor, darkTwoColor } from 'common/commonStyles/colors'

import { View, TouchableOpacity, Text, Platform } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'
import IconMembers from 'components/Icons/IconMembers'
import Settings from 'components/Icons/Settings'
import LogOut from 'components/Icons/LogOut'
import IconChat from 'components/Icons/IconChat'
import PrimaryButton from 'commonComponents/PrimaryButton'
import isIOS from 'utils/isIOS'
import LeftMenuButtonWithIcon from "components/menu/LeftMenuButtonWithIcon"

SettingsMenu.propTypes = {
  isModalOpen: PropTypes.bool,
  workspaceName: PropTypes.string.isRequired,
  isCurrentUserOrganizationGuest: PropTypes.bool.isRequired,
  onPressYourAccountButton: PropTypes.func.isRequired,
  onPressTeamSettingsButton: PropTypes.func.isRequired,
  onPressLogOutButton: PropTypes.func.isRequired,
  onConfirmLogOut: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
}

SettingsMenu.defultProps = {
  isModalOpen: false,
  isCurrentUserOrganizationGuest: false,
}

function SettingsMenu(props) {
  function renderSettingsLinks() {
    if (isIOS) {
      return (
        <LeftMenuButtonWithIcon
          icon={<Settings color={blueGreyColor} />}
          text={'Settings'}
          onPress={props.onPressYourAccountButton}
        />
      )
    } else {
      return (
        <React.Fragment>
          <LeftMenuButtonWithIcon
            icon={<IconMembers color={blueGreyColor} />}
            text={'Your account'}
            onPress={props.onPressYourAccountButton}
          />
          {!props.isCurrentUserOrganizationGuest && <LeftMenuButtonWithIcon
            icon={<Settings color={blueGreyColor} />}
            text={'Team settings'}
            onPress={props.onPressTeamSettingsButton}
          />
          }
          <LeftMenuButtonWithIcon
            icon={<IconChat color={blueGreyColor} />}
            text={'Support & Feedback'}
            onPress={props.onPressSupportButton}
          />
        </React.Fragment>
      )
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.workspaceButton} onPress={props.onNavigateToWorkspaceManagement}>
        <Text style={styles.workspaceName}>{props.workspaceName}</Text>
        <Text style={styles.workspaceButtonSubtitle}>{'Create or switch workspaces'}</Text>
      </TouchableOpacity>
      <View style={styles.divider}/>
      {renderSettingsLinks()}
      <LeftMenuButtonWithIcon
        icon={<LogOut color={blueGreyColor} />}
        text={'Log out'}
        onPress={props.onPressLogOutButton}
      />
      <UniversalModal
        isVisible={props.isModalOpen}
        onBackButtonPress={props.onCloseModal}
        onBackdropPress={props.onCloseModal}
      >
        <View style={styles.modalContent}>
          <Text>{'It looks like your file is still uploading. If you close the app, your changes will be lost. Are you sure you want to log out?'}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.button} onPress={props.onCloseModal}>
              <Text>{'Cancel'}</Text>
            </TouchableOpacity>
            <PrimaryButton
              style={styles.button}
              text={'Log out'}
              onPress={props.onConfirmLogOut}
            />
          </View>
        </View>
      </UniversalModal>
    </View>
  )
}

export default SettingsMenu

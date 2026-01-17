import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import { selectCurrentOrganizationActivePeopleWithoutBotCount } from 'models/domain/OrganizationsModel/selectors'
import { selectCurrentUserFullName } from 'models/domain/UsersModel/selectors/domain'
import {
  selectEnableEmailNotifications,
  selectEnableMobileNotifications,
} from 'models/domain/NotificationsModel/selectors/domain'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceGeneralSettings extends BaseComponent {

    static propTypes = {
      userName: PropTypes.string.isRequired,
      isEnableEmailNotifications: PropTypes.bool,
      isEnableMobileNotifications: PropTypes.bool,
      teamMembersCount: PropTypes.number.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          // data
          userName={this.props.userName}
          enabledNotificationsType={this.getEnabledNotificationsType()}
          teamMembersCount={this.props.teamMembersCount}

          // handler fns
          onNavigateToProfileSettings={this.onNavigateToProfileSettings}
          onNavigateToNotificationsSettings={this.onNavigateToNotificationsSettings}
          onNavigateToTeamMembers={this.onNavigateToTeamMembers}
          onNavigateToSupportMessenger={this.onNavigateToSupportMessenger}
        />
      )
    }

    getEnabledNotificationsType() {
      if (this.props.isEnableMobileNotifications && this.props.isEnableEmailNotifications) {
        return 'all'
      } else if (this.props.isEnableMobileNotifications) {
        return 'mobile'
      } else if (this.props.isEnableEmailNotifications) {
        return 'email'
      } else {
        return 'none'
      }
    }

    onNavigateToNotificationsSettings() {
      NavigationService.navigate(RouteName.NOTIFICATION_SETTINGS)
    }

    onNavigateToProfileSettings() {
      NavigationService.navigate(RouteName.PROFILE)
    }

    onNavigateToTeamMembers() {
      NavigationService.navigate(RouteName.TEAM_MANAGEMENT)
    }

    onNavigateToSupportMessenger() {
      NavigationService.navigate(RouteName.SUPPORT)
    }

  }

  const mapStateToProps = (state, props) => ({
    teamMembersCount: selectCurrentOrganizationActivePeopleWithoutBotCount(state),
    userName: selectCurrentUserFullName(state),

    isEnableEmailNotifications: selectEnableEmailNotifications(state),
    isEnableMobileNotifications: selectEnableMobileNotifications(state),
  })

  return connect(mapStateToProps)(EnhanceGeneralSettings)
}

export default enhance

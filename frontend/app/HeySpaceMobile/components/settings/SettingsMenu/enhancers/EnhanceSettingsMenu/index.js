import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions'
import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'
import { selectCurrentOrganizationName } from 'models/domain/OrganizationsModel/selectors/domain'
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceSettingsMenu extends BaseComponent {

    state = {
      isModalOpen: false,
    }

    static propTypes = {
      workspaceName: PropTypes.string.isRequired,
      fileInUploadName: PropTypes.string,
      onLogOut: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isModalOpen={this.state.isModalOpen}
          workspaceName={this.props.workspaceName}
          isCurrentUserOrganizationGuest={this.props.isCurrentUserOrganizationGuest}
          onPressYourAccountButton={this.onPressYourAccountButton}
          onPressTeamSettingsButton={this.onPressTeamSettingsButton}
          onPressLogOutButton={this.onTryLogOut}
          onPressSupportButton={this.onPressSupportButton}
          onConfirmLogOut={this.onLogOut}
          onCloseModal={this.onCloseModal}
          onNavigateToWorkspaceManagement={this.onNavigateToWorkspaceManagement}
        />
      )
    }

    onCloseModal() {
      this.setState({
        isModalOpen: false,
      })
    }

    onPressYourAccountButton() {
      NavigationService.navigate(RouteName.USER_SETTINGS_NAVIGATION)
    }

    onPressTeamSettingsButton() {
      NavigationService.navigate(RouteName.TEAM_MANAGEMENT)
    }

    onPressSupportButton() {
      NavigationService.navigate(RouteName.SUPPORT)
    }

    onLogOut() {
      this.onCloseModal()
      this.props.onLogOut()
    }

    onTryLogOut() {
      if (!this.props.fileInUploadName) {
        this.onLogOut()
      } else {
        this.setState({
          isModalOpen: true,
        })
      }
    }

    onNavigateToWorkspaceManagement() {
      NavigationService.navigate(RouteName.WORKSPACE_MANAGEMENT)
    }

  }

  function mapStateToProps(state) {
    return {
      fileInUploadName: FilesModelSelectors.selectFileInUploadName(state),
      workspaceName: selectCurrentOrganizationName(state),
      isCurrentUserOrganizationGuest: selectIsCurrentUserOrganizationGuest(state),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onLogOut: () => dispatch(CurrentUserModelActions.onSignOut()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSettingsMenu)
}

export default enhance

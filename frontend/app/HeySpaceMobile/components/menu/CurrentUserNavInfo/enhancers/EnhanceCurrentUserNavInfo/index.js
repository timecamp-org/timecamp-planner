import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectCurrentUserNickname, selectCurrentUserFirstName, selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectCurrentOrganizationName } from 'models/domain/OrganizationsModel/selectors/domain'

import BaseComponent from 'BaseComponent'
import { leftMenuTabTypes, leftMenuTabTypesValues } from '../../../LeftMenu/leftMenuTabTypes'

function enhance(ComposedComponent) {
  class EnhanceCurrentUserNavInfo extends BaseComponent {

    static propTypes = {
      selectedTab: PropTypes.oneOf(leftMenuTabTypesValues),
      onChangeSelectedTab: PropTypes.func.isRequired,

      currentUserId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      organizationName: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isSettingsTabSelected={this.props.selectedTab === leftMenuTabTypes.SETTINGS}
          currentUserId={this.props.currentUserId}
          username={this.props.username}
          organizationName={this.props.organizationName}
          onPress={this.onPress}
        />
      )
    }

    onPress() {
      let newTabType
      switch (this.props.selectedTab) {
        case leftMenuTabTypes.NAV: {
          newTabType = leftMenuTabTypes.SETTINGS
          break
        }
        case leftMenuTabTypes.SETTINGS: {
          newTabType = leftMenuTabTypes.NAV
          break
        }
        default: {
          newTabType = leftMenuTabTypes.SETTINGS
          break
        }
      }

      this.props.onChangeSelectedTab(newTabType)
    }

  }

  const mapStateToProps = (state, props) => {
    const firstName = selectCurrentUserFirstName(state)
    const nickname = selectCurrentUserNickname(state)
    const organizationName = selectCurrentOrganizationName(state)

    return {
      currentUserId: selectCurrentUserId(state),
      username: firstName ? firstName : nickname,
      organizationName,
    }
  }

  return connect(mapStateToProps)(EnhanceCurrentUserNavInfo)
}

export default enhance

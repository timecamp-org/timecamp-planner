import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { leftMenuTabTypes } from '../../leftMenuTabTypes'
import { selectIsDrawerNavigationOpened } from 'models/mobile/NavigationModel/selectors'
import { selectIsWorkspaceMembersValidForSubscription } from 'models/domain/SubscriptionLimitsModel/selectors'

function enhance(ComposedComponent) {
  class EnhanceLeftMenu extends BaseComponent {

    static propTypes = {
      isDrawerNavigationOpened: PropTypes.bool.isRequired,
    };


    state = {
      selectedTab: leftMenuTabTypes.NAV,
    }

    render() {
      return (
        <ComposedComponent
          selectedTab={this.getSelectedTab()}
          onChangeSelectedTab={this.onChangeSelectedTab}
        />
      )
    }

    getSelectedTab() {
      return this.isWorkspaceDisabled() ? leftMenuTabTypes.SETTINGS : this.state.selectedTab
    }

    isWorkspaceDisabled() {
      return !this.props.isWorkspaceMembersValidForSubscription
    }

    onChangeSelectedTab(tabType) {
      this.setState({
        selectedTab: tabType,
      })
    }

    componentDidUpdate(prevProps) {
      if (this.state.selectedTab === leftMenuTabTypes.SETTINGS
        && prevProps.isDrawerNavigationOpened
        && !this.props.isDrawerNavigationOpened) {
        this.setState({
          selectedTab: leftMenuTabTypes.NAV,
        })
      }
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      isWorkspaceMembersValidForSubscription: selectIsWorkspaceMembersValidForSubscription(state),
      isDrawerNavigationOpened: selectIsDrawerNavigationOpened(state),
    }
  }

  return connect(mapStateToProps)(EnhanceLeftMenu)
}

export default enhance

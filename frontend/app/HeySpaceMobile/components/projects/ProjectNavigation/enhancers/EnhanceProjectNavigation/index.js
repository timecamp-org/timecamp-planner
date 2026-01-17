import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { Animated, Dimensions } from 'react-native'
import tabTypes from '../../../ProjectView/constants'
import { moreButtonWidth } from '../../styles'
import {
  selectProjectColor,
  selectProjectIsDirectChat,
  selectProjectIsGroupOrDirectChat, selectProjectMembers
} from 'models/domain/ProjectsModel/selectors'
import { NavigationService } from 'common/services'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'

const { width: screenWidth } = Dimensions.get('window')

function enhance(ComposedComponent) {
  class EnhanceProjectNavigation extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      selectedTab: PropTypes.string.isRequired,
      onChangeTab: PropTypes.func.isRequired,

      projectIsGroupOrDirectChat: PropTypes.bool.isRequired,
      projectIsDirectChat: PropTypes.bool.isRequired,
      isCurrentUserOwnConversation: PropTypes.bool.isRequired,
    }

    state = {
      left: new Animated.Value(0),
      tabWidth: (screenWidth - moreButtonWidth) / 2,
      isPopoverVisible: false,
    }

    render() {
      return (
        <ComposedComponent
          selectedTab={this.props.selectedTab}
          isPopoverVisible={this.state.isPopoverVisible}
          tabWidth={this.state.tabWidth}
          left={this.state.left}
          projectColor={this.props.projectColor}
          projectIsGroupOrDirectChat={this.props.projectIsGroupOrDirectChat}
          projectIsDirectChat={this.props.projectIsDirectChat}
          isCurrentUserOwnConversation={this.props.isCurrentUserOwnConversation}

          onChangeTab={this.onChangeTab}
          onSetIsPopoverVisible={this.onSetIsPopoverVisible}
          onMoreMenuItemClick={this.onMoreMenuItemClick}
        />
      )
    }

    onChangeTab(tabType) {
      this.props.onChangeTab(tabType)

      this.animateSelectedTabIndicator(tabType)
    }

    animateSelectedTabIndicator(selectedTabType) {
      Animated.timing(this.state.left, {
        toValue: selectedTabType === tabTypes.CHAT ? 0 : this.state.tabWidth,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }

    onSetIsPopoverVisible(isPopoverVisible) {
      this.setState({
        isPopoverVisible,
      })
    }

    onMoreMenuItemClick(item) {
      const { routeName } = item
      this.onSetIsPopoverVisible(false)
      NavigationService.navigate(routeName, { projectId: this.props.projectId })
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.selectedTab !== this.props.selectedTab) {
        this.animateSelectedTabIndicator(this.props.selectedTab)
      }
    }

  }

  function mapStateToProps(state, props) {
    const projectIsDirectChat = selectProjectIsDirectChat(state, { projectId: props.projectId })
    const currentUserId = selectCurrentUserId(state)
    const projectMembers = selectProjectMembers(state, { projectId: props.projectId })
    const isCurrentUserOwnConversation = projectIsDirectChat && projectMembers.includes(currentUserId) && projectMembers.size === 1

    return {
      projectColor: selectProjectColor(state, { projectId: props.projectId }),
      projectIsGroupOrDirectChat: selectProjectIsGroupOrDirectChat(state, { projectId: props.projectId }),
      projectIsDirectChat,
      isCurrentUserOwnConversation,
    }
  }


  return connect(mapStateToProps)(EnhanceProjectNavigation)
}

export default enhance

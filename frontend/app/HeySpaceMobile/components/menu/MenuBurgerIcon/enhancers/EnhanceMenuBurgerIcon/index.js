import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectAllVisibleSpacesAndConversationsUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors'

import BaseComponent from 'BaseComponent'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceMenuBurgerIcon extends BaseComponent {

    static propTypes = {
      unreadMessagesCount: PropTypes.number.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          unreadMessagesCount={this.props.unreadMessagesCount}
          onPress={this.onToggleDrawer}
        />
      )
    }

    onToggleDrawer() {
      NavigationService.onToggleDrawer()
    }

  }

  const mapStateToProps = (state, props) => ({
    unreadMessagesCount: selectAllVisibleSpacesAndConversationsUnreadMessagesCount(state),
  })

  return connect(mapStateToProps)(EnhanceMenuBurgerIcon)
}

export default enhance

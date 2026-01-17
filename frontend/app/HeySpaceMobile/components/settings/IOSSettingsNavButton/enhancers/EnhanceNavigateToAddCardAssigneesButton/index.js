import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import RouteName from 'components/AppNavigation/routeNames'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceNavigateToAddCardAssigneesButton extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          text={'Add'}
          onPress={this.onPress}
        />
      )
    }

    onPress() {
      NavigationService.navigate(RouteName.MANAGE_CARD_ASSIGNEES_ADD, { taskId: this.props.taskId })
    }

  }

  return EnhanceNavigateToAddCardAssigneesButton
}

export default enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import MoreVertical from 'components/Icons/MoreVertical'
import RouteName from 'components/AppNavigation/routeNames'
import { selectProjectIsGroupOrDirectChat, selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors'
import styles from '../../styles'
import { blackColor } from 'common/commonStyles/colors'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceNavigateToManageSpaceButton extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      projectIsGroupOrDirectChat: PropTypes.bool.isRequired,
    }

    // TODO: I know its ugly, but it's a quick-fix for iOS app beta distribution
    render() {
      if (this.props.projectIsGroupOrDirectChat) {
        return null
      } else {
        return (
          <ComposedComponent
            icon={<MoreVertical svgProps={{ style: styles.moreVerticalIcon }} currentColor={blackColor} />}
            onPress={this.onPress}
          />
        )
      }
    }

    onPress() {
      NavigationService.navigate(RouteName.MANAGE_SPACE, { projectId: this.props.projectId })
    }

  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByConversationId(state, { conversationId: props.projectId }) || props.projectId
    return {
      projectIsGroupOrDirectChat: selectProjectIsGroupOrDirectChat(state, { projectId: projectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceNavigateToManageSpaceButton)
}

export default enhance

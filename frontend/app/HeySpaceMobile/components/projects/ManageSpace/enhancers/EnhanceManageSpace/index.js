import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import BaseComponent from 'BaseComponent'
import RouteName from '../../../../AppNavigation/routeNames'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import {
  selectProjectColor,
  selectProjectName,
  selectProjectDescription,
  selectIsCurrentUserProjectFollower,
} from 'models/domain/ProjectsModel/selectors'
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain'
import {
  onDescriptionUpdate,
  onNameUpdate,
  onColorUpdate,
  onMemberAdd,
  onFollowerAdd,
  onFollowerRemove,
} from 'models/domain/ProjectsModel/actions'
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types'
import { onFetchProjectViewData } from 'models/domain/RequestModel/actions'
import { selectProjectViewRequestIsRepeatable } from 'models/domain/RequestModel/selectors/projectViewRequest'
import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission';
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceManageSpace extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      currentUserId: PropTypes.string.isRequired,
      spaceName: PropTypes.string.isRequired,
      spacePurpose: PropTypes.string.isRequired,
      spaceMembersCount: PropTypes.number.isRequired,
      spaceColor: PropTypes.string.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,

      onChangeSpaceName: PropTypes.func.isRequired,
      onChangeSpacePurpose: PropTypes.func.isRequired,
      onChangeSpaceColor: PropTypes.func.isRequired,
      onFollowerAdd: PropTypes.func.isRequired,
      onFollowerRemove: PropTypes.func.isRequired,
      onResetCreateSpaceData: PropTypes.func.isRequired,
      onAddSpaceMember: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          spaceName={this.props.spaceName}
          spacePurpose={this.props.spacePurpose}
          spaceMembersCount={this.props.spaceMembersCount}
          spaceColor={this.props.spaceColor}
          isCurrentUserFollowingSpace={this.props.isCurrentUserFollowingSpace}
          isProjectEditable={this.props.isProjectEditable}

          onChangeSpaceName={this.props.onChangeSpaceName}
          onChangeSpacePurpose={this.props.onChangeSpacePurpose}
          onChangeIsCurrentUserFollowingSpace={this.onChangeIsCurrentUserFollowingSpace}
          onNavigateToSpaceMembers={this.onNavigateToManageSpaceMembers}
          onNavigateToSpaceColor={this.onNavigateToManageSpaceColor}
          onNavigateToSpacePrivacy={this.onNavigateToManageSpacePrivacy}
          onNavigateToSpaceChatNotifications={this.onNavigateToManageSpaceChatNotifications}
        />
      )
    }

    onChangeIsCurrentUserFollowingSpace() {
      if (this.props.isCurrentUserFollowingSpace) {
        this.props.onFollowerRemove(this.props.currentUserId)
      } else {
        this.props.onFollowerAdd(this.props.currentUserId)
      }
    }

    onNavigateToManageSpaceMembers() {
      NavigationService.navigate(RouteName.MANAGE_SPACE_MEMBERS, { projectId: this.props.projectId })
    }

    onNavigateToManageSpaceColor() {
      NavigationService.navigate(RouteName.MANAGE_SPACE_COLOR, { projectId: this.props.projectId })
    }

    onNavigateToManageSpacePrivacy() {
      NavigationService.navigate(RouteName.MANAGE_SPACE_PRIVACY, { projectId: this.props.projectId })
    }

    onNavigateToManageSpaceChatNotifications() {
      NavigationService.navigate(RouteName.MANAGE_SPACE_CHAT_NOTIFICATIONS, { projectId: this.props.projectId })
    }

    componentDidMount() {
      if (this.props.isRequestRepeatable) {
        this.props.onFetchProjectViewData()
      }
    }


  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    spaceName: selectProjectName(state, { projectId: props.projectId }),
    spacePurpose: selectProjectDescription(state, { projectId: props.projectId }),
    spaceMembersCount: selectProjectPeople(state, { projectId: props.projectId }).size,
    spaceColor: selectProjectColor(state, { projectId: props.projectId }),
    isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, { projectId: props.projectId }),
    isRequestRepeatable: selectProjectViewRequestIsRepeatable(state, { projectId: props.projectId }),
    isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeSpaceName: (spaceName) => dispatch(onNameUpdate(props.projectId, spaceName)),
    onChangeSpacePurpose: (spacePurpose) => dispatch(onDescriptionUpdate(props.projectId, spacePurpose)),
    onFollowerAdd: (userId) => dispatch(onFollowerAdd(props.projectId, userId)),
    onFollowerRemove: (userId) => dispatch(onFollowerRemove(props.projectId, userId)),
    onChangeSpaceColor: (spaceColor) => dispatch(onColorUpdate(props.projectId, spaceColor)),
    onAddSpaceMember: (userId) => dispatch(onMemberAdd(props.projectId, userId, ProjectPeopleRole.MEMBER)),
    onFetchProjectViewData: () => dispatch(onFetchProjectViewData(props.projectId)),
  })

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceManageSpace))
}

export default enhance

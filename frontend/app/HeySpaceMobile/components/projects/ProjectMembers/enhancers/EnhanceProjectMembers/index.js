import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectProjectMembers, selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission'
import { onMemberRemove } from 'models/domain/ProjectsModel/actions'

import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { NavigationService } from 'common/services'
import RouteName from '../../../../AppNavigation/routeNames'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceProjectMembers extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
    }

    state = {
      isRemoveModalOpen: false,
      userId: null,
    }

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}
          styles={this.props.styles}

          projectPeople={this.props.projectPeople}
          projectColor={this.props.projectColor}
          isRemoveModalOpen={this.state.isRemoveModalOpen}
          isCurrentUserOrganizationGuest={this.props.isCurrentUserOrganizationGuest}
          isProjectEditable={this.props.isProjectEditable}

          onRemoveModalOpen={this.onRemoveModalOpen}
          onRemoveModalClose={this.onRemoveModalClose}
          onRemoveMember={this.onRemoveMember}

          onAddUserModalOpen={this.onAddUserModalOpen}
          onAddUserModalClose={this.onAddUserModalClose}
          shouldRenderRemoveUser={this.shouldRenderRemoveUser}
          onNavigateToAddMembers={this.onNavigateToAddMembers}
        />
      )
    }

    onNavigateToAddMembers() {
      NavigationService.navigate(RouteName.PROJECT_MEMBERS_ADD, { projectId: this.props.projectId })
    }

    onRemoveModalOpen(userId) {
      this.setState({
        isRemoveModalOpen: true,
        userId,
      })
    }

    onRemoveModalClose() {
      this.setState({
        isRemoveModalOpen: false,
        userId: null,
      })
    }

    onRemoveMember() {
      const { userId } = this.state
      this.props.onRemoveMemberFromSpace(userId)
      this.onRemoveModalClose()
    }

    shouldRenderRemoveUser(userId) {
      return this.props.isProjectEditable || userId === this.props.currentUserId
    }

  }

  function mapStateToProps(state, props) {
    return {
      projectPeople: selectProjectMembers(state, { projectId: props.projectId }),
      projectColor: selectProjectColor(state, { projectId: props.projectId }),
      isCurrentUserOrganizationGuest: selectIsCurrentUserOrganizationGuest(state),
      isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
      currentUserId: selectCurrentUserId(state),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onRemoveMemberFromSpace: (userId) => dispatch(onMemberRemove(props.projectId, userId)),
    }
  }

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceProjectMembers))
}

export default Enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain'
import { selectCurrentOrganizationAllGuestUserIds } from 'models/domain/OrganizationsModel/selectors'
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'
import { onMemberAdd } from 'models/domain/ProjectsModel/actions'
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types'
import { searchUserIdsByText } from 'models/component/SearchModel/utils'
import { NavigationService } from 'common/services'
import RouteName from '../../../../AppNavigation/routeNames'

import { withMappedNavigationParams } from 'react-navigation-props-mapper'

function Enhance(ComposedComponent) {
  class EnhanceAddProjectMembers extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      projectId: PropTypes.string.isRequired,
    }

    state = {
      text: '',
      userIds: this.getAllUserIds(),
    }

    render() {
      return (
        <ComposedComponent
          setTextInputRef={this.setTextInputRef}
          blurTextInput={this.blurTextInput}

          projectPeople={this.props.projectPeople}
          projectColor={this.props.projectColor}

          text={this.state.text}
          userIds={this.state.text === '' ? this.getAllUserIds() : this.state.userIds}

          onChangeText={this.onChangeText}
          onAddUserToProject={this.onAddUserToProject}
        />
      )
    }

    setTextInputRef(ref) {
      this.textInputRef = ref
    }

    blurTextInput() {
      if (this.textInputRef) {
        this.textInputRef.blur()
      }
    }

    onChangeText(text) {
      this.setState({
        text,
        userIds: text !== '' ? this.getUserIds(text) : this.getAllUserIds(),
      })
    }

    getAllUserIds() {
      const userIds = this.props.usersSearchNames.keySeq().toList()
      return userIds.filter(userId => !this.props.projectPeople.includes(userId) && !this.props.guestIds.includes(userId))
    }

    getUserIds(value) {
      const { usersSearchNames, projectPeople } = this.props
      let userIds = searchUserIdsByText(usersSearchNames, value, projectPeople)
      userIds = userIds.filter(userId => !this.props.guestIds.includes(userId))

      return userIds
    }

    onAddUserToProject(userId) {
      this.props.onAddUserToProject(userId)
      NavigationService.navigate(RouteName.PROJECT_MEMBERS, { projectId: this.props.projectId })
    }

  }

  function mapStateToProps(state, props) {
    return {
      projectPeople: selectProjectPeople(state, { projectId: props.projectId }),
      guestIds: selectCurrentOrganizationAllGuestUserIds(state, { projectId: props.projectId }),
      projectColor: selectProjectColor(state, { projectId: props.projectId }),
      usersSearchNames: selectUsersSearchName(state),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onAddUserToProject: (userId) => dispatch(onMemberAdd(props.projectId, userId, ProjectPeopleRole.MEMBER)),
    }
  }

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceAddProjectMembers))
}

export default Enhance

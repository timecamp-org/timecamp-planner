import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { searchUserIdsByText } from 'models/component/SearchModel/utils';

import BaseComponent from 'BaseComponent';
import { onMemberAdd } from 'models/domain/ProjectsModel/actions';
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain';
import { selectInvitableOrganizationMembers } from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { selectDeactivatedUserIds } from 'models/domain/OrganizationsModel/selectors/domain';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

function enhance(ComposedComponent) {
  class EnhanceManageSpaceAddMember extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      spaceMemberIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      invitableUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      usersSearchNames: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,

      onAddSpaceMember: PropTypes.func.isRequired,
    };

    state = {
      inputValue: '',
      userIds: this.props.invitableUserIds,
    };

    render() {
      return (
        <ComposedComponent
          inputValue={this.state.inputValue}
          userIds={this.state.userIds}
          emptyUserListMessage={'No users to add to project'}
          onChangeText={this.onChangeText}
          onItemPress={this.props.onAddSpaceMember}
        />
      );
    }

    getUserIds(value) {
      if (value === '') {
        return this.props.invitableUserIds;
      } else {
        const { usersSearchNames, spaceMemberIds, deactivatedUserIds } = this.props;
        return searchUserIdsByText(usersSearchNames, value, spaceMemberIds.concat(deactivatedUserIds));
      }
    }

    onChangeText(inputValue) {
      this.setState({
        inputValue,
        userIds: this.getUserIds(inputValue),
      });
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      if (!is(prevProps.spaceMemberIds, this.props.spaceMemberIds)) {
        this.setState((currentState) => ({
          userIds: this.getUserIds(currentState.inputValue),
        }));
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    usersSearchNames: selectUsersSearchName(state),
    spaceMemberIds: selectProjectPeople(state, { projectId: props.projectId }),
    invitableUserIds: selectInvitableOrganizationMembers(state, { projectId: props.projectId }),
    deactivatedUserIds: selectDeactivatedUserIds(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onAddSpaceMember: (userId) => dispatch(onMemberAdd(props.projectId, userId, ProjectPeopleRole.MEMBER)),
  });

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceManageSpaceAddMember));
}

export default enhance;

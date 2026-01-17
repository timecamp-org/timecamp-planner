import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { searchUserIdsByText } from 'models/component/SearchModel/utils';

import BaseComponent from 'BaseComponent';
import { selectSpaceMembers, selectInvitableOrganizationMembers } from 'models/mobile/CreateSpaceModel/selectors';
import { onAddSpaceMember } from 'models/mobile/CreateSpaceModel/actions';
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain';
import { selectDeactivatedUserIds } from 'models/domain/OrganizationsModel/selectors/domain';

function enhance(ComposedComponent) {
  class EnhanceCreateSpaceAddMembersScreen extends BaseComponent {
    static propTypes = {
      spaceMemberIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
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
    spaceMemberIds: selectSpaceMembers(state),
    invitableUserIds: selectInvitableOrganizationMembers(state),
    deactivatedUserIds: selectDeactivatedUserIds(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onAddSpaceMember: (userId) => dispatch(onAddSpaceMember(userId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateSpaceAddMembersScreen);
}

export default enhance;

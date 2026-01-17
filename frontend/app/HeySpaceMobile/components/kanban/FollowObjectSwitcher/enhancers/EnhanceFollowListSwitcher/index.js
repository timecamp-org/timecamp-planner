import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BaseComponent from 'BaseComponent';

import {
  selectListColor,
  selectProjectIdByListId,
  selectIsCurrentUserListFollower,
} from 'models/domain/ListsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { onAddUserToTaskListFollowers, onRemoveUserFromTaskListFollowers } from 'models/domain/ListsModel/actions';
import { selectIsCurrentUserProjectFollower } from 'models/domain/ProjectsModel/selectors';

function Enhance(ComposedComponent) {
  class EnhanceFollowListSwitcher extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    };

    state = {
      value: this.getValue(),
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.value}
          isDisabled={this.props.isCurrentUserFollowingSpace}
          color={this.props.listColor}
          getLabel={this.getLabel}
          onValueChange={this.onValueChange}
        />
      );
    }

    getLabel() {
      if (!this.getValue()) {
        return 'Follow List';
      } else if (this.props.isCurrentUserFollowingSpace) {
        return 'Following Project';
      } else {
        return 'Following List';
      }
    }

    getValue(props = this.props) {
      return this.props.isCurrentUserFollowingList || props.isCurrentUserFollowingSpace;
    }

    onValueChange(value) {
      this.setState({ value });
      if (value) {
        this.props.onStartFollowing(this.props.currentUserId);
      } else {
        this.props.onStopFollowing(this.props.currentUserId);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByListId(state, { listId: props.listId });
    return {
      listColor: selectListColor(state, { listId: props.listId }),
      currentUserId: selectCurrentUserId(state),
      isCurrentUserFollowingList: selectIsCurrentUserListFollower(state, { listId: props.listId }),
      isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, { projectId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onStartFollowing: (currentUserId) => dispatch(onAddUserToTaskListFollowers(props.listId, currentUserId)),
    onStopFollowing: (currentUserId) => dispatch(onRemoveUserFromTaskListFollowers(props.listId, currentUserId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceFollowListSwitcher);
}

export default Enhance;

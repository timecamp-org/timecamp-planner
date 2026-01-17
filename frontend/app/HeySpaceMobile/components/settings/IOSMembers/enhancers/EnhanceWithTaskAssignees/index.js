import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import handleError from 'common/utils/handleError';

import BaseComponent from 'BaseComponent';
import { selectUsersName } from 'models/domain/UsersModel/selectors/domain';
import { selectTaskAssigneeIds } from 'models/domain/TasksModel/selectors/domain';
import { onRemoveFromTaskPeople } from 'models/domain/TasksModel/actions';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

export const listOptionsTypes = {
  REMOVE_ASSIGNEE: 'Remove assignee',
};

export const listOptions = [listOptionsTypes.REMOVE_ASSIGNEE];

export const destructiveOptions = [listOptionsTypes.REMOVE_ASSIGNEE];

function enhance(ComposedComponent) {
  class EnhanceWithTaskAssignees extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      taskAssigneeIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      userNamesByIds: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,
      onRemoveFromTaskPeople: PropTypes.func.isRequired,
    };

    state = {
      isActionSheetOpen: false,
      selectedUserId: null,
    };

    render() {
      return (
        <ComposedComponent
          userIds={this.props.taskAssigneeIds}
          userNamesByIds={this.props.userNamesByIds}
          isActionSheetOpen={this.state.isActionSheetOpen}
          selectedUserId={this.state.selectedUserId}
          emptyUserListMessage={'No task assignees'}
          areItemsClickable={true}
          listOptions={listOptions}
          destructiveOptions={destructiveOptions}
          onItemPress={this.onItemPress}
          onCloseActionSheet={this.onCloseActionSheet}
          onOptionSelect={this.onOptionSelect}
        />
      );
    }

    onItemPress(userId) {
      this.setState({
        isActionSheetOpen: true,
        selectedUserId: userId,
      });
    }

    onCloseActionSheet() {
      this.setState({
        isActionSheetOpen: false,
        selectedUserId: null,
      });
    }

    onOptionSelect(index) {
      const option = listOptions[index];
      switch (option) {
        case listOptionsTypes.REMOVE_ASSIGNEE: {
          this.props.onRemoveFromTaskPeople(this.state.selectedUserId);
          this.onCloseActionSheet();
          break;
        }

        default: {
          handleError(new Error(`Selected option not implemented: ${option}`));
          break;
        }
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    taskAssigneeIds: selectTaskAssigneeIds(state, { taskId: props.taskId }),
    userNamesByIds: selectUsersName(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onRemoveFromTaskPeople: (userId) => dispatch(onRemoveFromTaskPeople(props.taskId, userId)),
  });

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceWithTaskAssignees));
}

export default enhance;

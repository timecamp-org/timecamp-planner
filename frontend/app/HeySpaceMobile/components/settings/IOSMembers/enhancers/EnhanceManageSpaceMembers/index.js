import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import handleError from 'common/utils/handleError';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

import BaseComponent from 'BaseComponent';
import { selectCurrentUserId, selectUsersName } from 'models/domain/UsersModel/selectors/domain';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { onMemberRemove } from 'models/domain/ProjectsModel/actions';
import { selectIsProjectEditable } from '../../../../../../common/models/domain/ProjectsModel/selectors/permission';
import { NavigationService } from 'common/services';
import RouteName from '../../../../AppNavigation/routeNames';

export const listOptionsTypes = {
  REMOVE_FROM_SPACE: 'Remove from project',
};

export const listOptions = [listOptionsTypes.REMOVE_FROM_SPACE];

export const destructiveOptions = [listOptionsTypes.REMOVE_FROM_SPACE];

function enhance(ComposedComponent) {
  class EnhanceManageSpaceMembers extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      spaceMemberIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      userNamesByIds: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,
      onRemoveSpaceMember: PropTypes.func.isRequired,
    };

    state = {
      isActionSheetOpen: false,
      selectedUserId: null,
    };

    render() {
      return (
        <ComposedComponent
          userIds={this.props.spaceMemberIds}
          userNamesByIds={this.props.userNamesByIds}
          isActionSheetOpen={this.state.isActionSheetOpen}
          selectedUserId={this.state.selectedUserId}
          emptyUserListMessage={'No project members'}
          areItemsClickable={this.props.isProjectEditable}
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
        case listOptionsTypes.REMOVE_FROM_SPACE: {
          this.props.onRemoveSpaceMember(this.state.selectedUserId);
          this.onCloseActionSheet();
          this.redirectIfLeavingSpace(this.state.selectedUserId);
          break;
        }

        default: {
          handleError(new Error(`Selected option not implemented: ${option}`));
          break;
        }
      }
    }

    redirectIfLeavingSpace(userId) {
      if (userId === this.props.currentUserId) {
        NavigationService.reset(RouteName.PROJECT_LOADER);
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    spaceMemberIds: selectProjectPeople(state, { projectId: props.projectId }),
    userNamesByIds: selectUsersName(state),
    isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onRemoveSpaceMember: (userId) => dispatch(onMemberRemove(props.projectId, userId)),
  });

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceManageSpaceMembers));
}

export default enhance;

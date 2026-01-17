import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import BaseComponent from 'BaseComponent';
import { selectSpaceMembers } from 'models/mobile/CreateSpaceModel/selectors';
import { onRemoveSpaceMember } from 'models/mobile/CreateSpaceModel/actions';
import { selectUsersName } from 'models/domain/UsersModel/selectors/domain';
import handleError from 'common/utils/handleError';

export const listOptionsTypes = {
  REMOVE_FROM_SPACE: 'Remove from project',
};

export const listOptions = [listOptionsTypes.REMOVE_FROM_SPACE];

export const destructiveOptions = [listOptionsTypes.REMOVE_FROM_SPACE];

function enhance(ComposedComponent) {
  class EnhanceCreateSpaceMembers extends BaseComponent {
    static propTypes = {
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
        case listOptionsTypes.REMOVE_FROM_SPACE: {
          this.props.onRemoveSpaceMember(this.state.selectedUserId);
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
    spaceMemberIds: selectSpaceMembers(state),
    userNamesByIds: selectUsersName(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onRemoveSpaceMember: (userId) => dispatch(onRemoveSpaceMember(userId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateSpaceMembers);
}

export default enhance;

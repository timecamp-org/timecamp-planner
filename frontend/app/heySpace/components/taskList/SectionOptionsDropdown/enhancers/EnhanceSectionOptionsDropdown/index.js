import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  selectProjectColor,
  selectIsCurrentUserProjectFollower,
} from "models/domain/ProjectsModel/selectors";
import {
  selectListFollowers,
  selectProjectIdByListId,
  selectListIsArchived,
} from "models/domain/ListsModel/selectors";
import {
  onAddUserToTaskListFollowers,
  onRemoveUserFromTaskListFollowers,
  onUpdateList,
} from "models/domain/ListsModel/actions";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";
import EnhanceWithClickOutside from "react-click-outside";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceSectionOptionsDropdown extends BaseComponent {
    static propTypes = {
      sectionId: PropTypes.string.isRequired,
      onCopySection: PropTypes.func,

      listFollowers: ImmutablePropTypes.list.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,
      currentUserId: PropTypes.string.isRequired,
      onStartFollowing: PropTypes.func.isRequired,
      onStopFollowing: PropTypes.func.isRequired,
    };

    state = {
      contentType: null,
      shouldRenderFollowingSwitcherInfoTooltip: false,
    };

    render() {
      return (
        <ComposedComponent
          sectionId={this.props.sectionId}
          projectId={this.props.projectId}
          userId={this.props.userId}
          contentType={this.state.contentType}
          sectionOptions={this.props.sectionOptions}
          color={this.props.color}
          isArchived={this.props.isArchived}
          onGoBack={this.onGoBack}
          onAddCard={this.props.onAddCard}
          onSetIsDropdownVisible={this.props.onSetIsDropdownVisible}
          onChangeContentType={this.onChangeContentType}
          onCopySectionDispatched={this.props.onCopySectionDispatched}
          onCopySectionCancelled={this.props.onCopySectionCancelled}
          onMoveSectionDispatched={this.props.onMoveSectionDispatched}
          onMoveSectionCancelled={this.props.onMoveSectionCancelled}
          onCardLimitCancelled={this.props.onCardLimitCancelled}
          onMoveAllCardsDispatched={this.props.onMoveAllCardsDispatched}
          onMoveAllCardsCancelled={this.props.onMoveAllCardsCancelled}
          onClickArchiveList={this.onClickArchiveList}
          onClickUnarchiveList={this.onUnarchiveList}
          isSectionFollowed={
            this.isCurrentUserFollowingList() ||
            this.props.isCurrentUserFollowingSpace
          }
          isSectionFollowingSwitcherDisabled={this.getIsSectionFollowingSwitcherDisabled()}
          shouldRenderFollowingSwitcherInfoTooltip={
            this.state.shouldRenderFollowingSwitcherInfoTooltip
          }
          onMouseEnterFollowingController={this.onMouseEnterFollowingController}
          onMouseLeaveFollowingController={this.onMouseLeaveFollowingController}
          onToggleSectionFollowing={this.onToggleSectionFollowing}
          t={this.props.t}
        />
      );
    }

    isCurrentUserFollowingList() {
      return this.props.listFollowers.includes(this.props.currentUserId);
    }

    onChangeContentType(contentType) {
      this.prevContentType = this.state.contentType;
      this.setState({
        contentType,
      });
    }

    onGoBack() {
      this.setState({
        contentType: this.prevContentType,
      });
    }

    onUnarchiveList() {
      this.props.onUnarchiveList();
    }

    onClickArchiveList() {
      this.props.onClickArchiveList();
    }

    getIsSectionFollowingSwitcherDisabled() {
      return this.props.isCurrentUserFollowingSpace;
    }

    onToggleSectionFollowing() {
      const { currentUserId, onStopFollowing, onStartFollowing } = this.props;

      if (this.getIsSectionFollowingSwitcherDisabled()) {
        // do nothing, if user is following project containing this section we don't let him unfollow it by hand
      } else {
        if (this.isCurrentUserFollowingList()) {
          onStopFollowing(currentUserId);
        } else {
          onStartFollowing(currentUserId);
        }
      }
    }

    onMouseEnterFollowingController() {
      if (this.getIsSectionFollowingSwitcherDisabled()) {
        this.showTooltipTimeout = setTimeout(
          () =>
            this.setState({
              shouldRenderFollowingSwitcherInfoTooltip: true,
            }),
          500
        );
      }
    }

    onMouseLeaveFollowingController() {
      if (this.getIsSectionFollowingSwitcherDisabled()) {
        if (this.showTooltipTimeout) {
          clearTimeout(this.showTooltipTimeout);
        }

        this.setState({
          shouldRenderFollowingSwitcherInfoTooltip: false,
        });
      }
    }

    handleClickOutside() {
      this.props.onSetIsDropdownVisible(false);
    }

    componentWillUnmount() {
      if (this.showTooltipTimeout) {
        clearTimeout(this.showTooltipTimeout);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByListId(state, {
      listId: props.sectionId,
    });
    return {
      color: selectProjectColor(state, { projectId }),
      listFollowers: selectListFollowers(state, { listId: props.sectionId }),
      isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, {
        projectId,
      }),
      currentUserId: selectCurrentUserId(state),
      isArchived: selectListIsArchived(state, { listId: props.sectionId }),
      projectId,
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onStartFollowing: (currentUserId) =>
      dispatch(onAddUserToTaskListFollowers(props.sectionId, currentUserId)),
    onStopFollowing: (currentUserId) =>
      dispatch(
        onRemoveUserFromTaskListFollowers(props.sectionId, currentUserId)
      ),
    onUnarchiveList: () =>
      dispatch(onUpdateList(props.sectionId, { isArchived: false })),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceSectionOptionsDropdown);
}

export default Enhance;

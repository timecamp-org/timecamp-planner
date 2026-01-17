import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { List } from "immutable";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import EnhanceWithClickOutside from "react-click-outside";

import { selectUserSharedSpaceIdsWithCurrentUser } from "models/domain/ProjectsModel/selectors";
import { selectSortedAvailableVisibleSpacesIds } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";
import { onConvertMessageToCardComment } from "models/domain/MessagesModel/actions";
import { selectMessageAuthorName } from "models/domain/MessagesModel/selectors";
import { selectProjectsListIds } from "models/domain/ListsModel/selectors";
import {
  selectListIsArchivedStatuses,
  selectTasksOrderByList,
} from "models/domain/ListsModel/selectors/domain";
import { onFetchProjectListsAndTasksData } from "models/domain/RequestModel/actions";
import { selectTaskIsArchivedStatuses } from "../../../../../../common/models/domain/TasksModel/selectors/domain";
import { selectIsCurrentUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors";
import { doNothing } from "common/utils";

const emptyList = new List();

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceConvertMessageToCardComment extends BaseComponent {
    static propTypes = {
      // uses
      messageId: PropTypes.string.isRequired,
      conversationWithUserId: PropTypes.string,
      spaceId: PropTypes.string,
      isConvertMessageToTaskPopoverOpen: PropTypes.bool,
      onCloseConvertMessagePopover: PropTypes.func.isRequired,
      onClickConvertMessageButton: PropTypes.func.isRequired,

      // this enhancer
      spaceIds: ImmutablePropTypes.list.isRequired,
      spacesSections: ImmutablePropTypes.map.isRequired,
      tasksOrderByListIds: ImmutablePropTypes.map.isRequired,
      listsIsArchivedStatuses: ImmutablePropTypes.map.isRequired,
      onFetchProjectListsAndTasksData: PropTypes.func.isRequired,
      onClickClosePopover: PropTypes.func,
      onConvertMessage: PropTypes.func,
    };

    static defaultProps = {
      onClickClosePopover: doNothing,
      onConvertMessage: doNothing,
    };

    constructor(props) {
      super(props);

      const selectedSpaceId = this.props.spaceId || this.props.spaceIds.first();
      const selectedListId = this.getListIds(selectedSpaceId).first();
      const cardsInOrder = this.getCardIds(
        selectedListId,
        this.props.tasksOrderByListIds
      );

      this.state = {
        selectedSpaceId,
        selectedListId,
        selectedCardId: cardsInOrder.first(),
      };
    }

    render() {
      return (
        <ComposedComponent
          isPopoverOpened={this.props.isConvertMessageToTaskPopoverOpen}
          spaceIds={this.props.spaceIds}
          listIds={this.getListIds(this.state.selectedSpaceId)}
          cardIds={this.getCardIds(this.state.selectedListId)}
          selectedSpaceId={this.state.selectedSpaceId}
          selectedListId={this.state.selectedListId}
          selectedCardId={this.state.selectedCardId}
          cardName={this.state.cardName}
          renderTargetComponent={this.props.renderTargetComponent}
          isAddCardDisabled={this.isAddCardDisabled()}
          onTargetButtonClick={this.onTargetButtonClick}
          onClickClosePopover={this.onClickClosePopover}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onSelectCardId={this.onSelectCardId}
          onConvertMessageToCardComment={this.onConvertMessageToCardComment}
        />
      );
    }

    onClickClosePopover() {
      this.props.onClickClosePopover();
      this.props.onCloseConvertMessagePopover();
    }

    getListIds(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId) || emptyList;
      return spaceListIds.filter(
        (listId) => this.props.listsIsArchivedStatuses.get(listId) === false
      );
    }

    getCardIds(
      selectedListId,
      tasksOrderByListIds = this.props.tasksOrderByListIds
    ) {
      const cardsOrderByListId = tasksOrderByListIds.get(selectedListId);
      if (!cardsOrderByListId) {
        return emptyList;
      } else {
        return cardsOrderByListId
          .sort((a, b) => a - b)
          .keySeq()
          .toList()
          .filter(
            (taskId) => this.props.tasksIsArchivedStatuses.get(taskId) === false
          );
      }
    }

    onConvertMessageToCardComment() {
      const { selectedCardId } = this.state;
      if (selectedCardId) {
        this.props.onConvertMessageToCardComment(
          this.props.messageId,
          selectedCardId
        );
        this.props.onCloseConvertMessagePopover();

        this.props.onConvertMessage();
      }
    }

    onTargetButtonClick() {
      this.props.onFetchProjectListsAndTasksData(this.state.selectedSpaceId);
      this.props.onClickConvertMessageButton();
      this.setState((prevState) => {
        const selectedListId = this.getListIds(
          prevState.selectedSpaceId
        ).first();
        const selectedCardId = this.getCardIds(selectedListId).first();
        return {
          selectedListId,
          selectedCardId,
        };
      });
    }

    onSelectSpaceId(selectedSpaceId) {
      this.props.onFetchProjectListsAndTasksData(selectedSpaceId);
      const selectedListId = this.getListIds(selectedSpaceId).first();
      const selectedCardId = this.getCardIds(selectedListId).first();
      this.setState({
        selectedSpaceId,
        selectedListId,
        selectedCardId,
      });
    }

    onSelectListId(selectedListId) {
      const selectedCardId = this.getCardIds(selectedListId).first();
      this.setState({
        selectedListId,
        selectedCardId,
      });
    }

    onSelectCardId(selectedCardId) {
      this.setState({
        selectedCardId,
      });
    }

    handleClickOutside(event) {
      if (
        this.props.isConvertMessageToTaskPopoverOpen &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.props.onCloseConvertMessagePopover();
      }
    }

    isAddCardDisabled() {
      return (
        !this.state.selectedSpaceId && this.props.isCurrentUserOrganizationGuest
      );
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      const { selectedSpaceId } = this.state;
      const prevFirstListId = this.getListIds(
        selectedSpaceId,
        prevProps.spacesSections
      ).first();
      const currFirstListId = this.getListIds(
        selectedSpaceId,
        this.props.spacesSections
      ).first();

      if (!prevFirstListId && prevFirstListId !== currFirstListId) {
        this.setState({
          selectedListId: currFirstListId,
          selectedCardId: this.getCardIds(currFirstListId).first(),
        });
      }

      const prevFirstCardId = this.getCardIds(
        currFirstListId,
        prevProps.tasksOrderByListIds
      ).first();
      const currFirstCardId = this.getCardIds(
        currFirstListId,
        this.props.tasksOrderByListIds
      ).first();

      if (!prevFirstCardId && prevFirstCardId !== currFirstCardId) {
        this.setState({
          selectedCardId: currFirstCardId,
        });
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      spaceIds: props.conversationWithUserId
        ? selectUserSharedSpaceIdsWithCurrentUser(state, {
            userId: props.conversationWithUserId,
          })
        : selectSortedAvailableVisibleSpacesIds(state),
      spacesSections: selectProjectsListIds(state),
      tasksOrderByListIds: selectTasksOrderByList(state),
      listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
      tasksIsArchivedStatuses: selectTaskIsArchivedStatuses(state),
      messageAuthorName: selectMessageAuthorName(state, {
        messageId: props.messageId,
      }),
      isCurrentUserOrganizationGuest:
        selectIsCurrentUserOrganizationGuest(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onFetchProjectListsAndTasksData: (projectId) =>
      dispatch(onFetchProjectListsAndTasksData(projectId)),
    onConvertMessageToCardComment: (messageId, objectId) =>
      dispatch(onConvertMessageToCardComment(messageId, objectId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceConvertMessageToCardComment);
}

export default enhance;

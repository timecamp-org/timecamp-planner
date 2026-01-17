import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { List } from "immutable";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import EnhanceWithClickOutside from "react-click-outside";

import { selectUserSharedSpaceIdsWithCurrentUser } from "models/domain/ProjectsModel/selectors";
import { selectSortedAvailableVisibleSpacesIds } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";
import { onConvertConversationMessageToTask } from "models/domain/MessagesModel/actions";
import { selectParsedMessageText } from "models/domain/MessagesModel/selectors";
import { selectProjectsListIds } from "models/domain/ListsModel/selectors";
import { selectListIsArchivedStatuses } from "models/domain/ListsModel/selectors/domain";
import { onFetchProjectListsData } from "models/domain/RequestModel/actions";
import { selectIsCurrentUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors";
import { doNothing } from "common/utils";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceConvertMessageToCard extends BaseComponent {
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
      listsIsArchivedStatuses: ImmutablePropTypes.map.isRequired,
      onConvertConversationMessageToTask: PropTypes.func.isRequired,
      onFetchProjectListsData: PropTypes.func.isRequired,
      onClickClosePopover: PropTypes.func,
      onConvertMessage: PropTypes.func,
    };

    static defaultProps = {
      onClickClosePopover: doNothing,
      onConvertMessage: doNothing,
    };

    constructor(props) {
      super(props);

      const spaceId = this.props.spaceId || this.props.spaceIds.first();

      this.state = {
        isPopoverOpened: false,
        selectedSpaceId: spaceId,
        selectedListId: this.getListIds(spaceId).first(),
        listIds: this.props.spacesSections.get(spaceId),
        cardName: this.props.messageText,
      };
    }

    render() {
      return (
        <ComposedComponent
          isPopoverOpened={this.props.isConvertMessageToTaskPopoverOpen}
          spaceIds={this.props.spaceIds}
          listIds={this.getListIds(this.state.selectedSpaceId)}
          selectedSpaceId={this.state.selectedSpaceId}
          selectedListId={this.state.selectedListId}
          cardName={this.state.cardName}
          renderTargetComponent={this.props.renderTargetComponent}
          isAddCardDisabled={this.isAddCardDisabled()}
          onTargetButtonClick={this.onTargetButtonClick}
          onClickClosePopover={this.onClickClosePopover}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onConvertMessageToTask={this.onConvertMessageToTask}
          onChangeCardName={this.onChangeCardName}
        />
      );
    }

    getListIds(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId) || new List();
      return spaceListIds.filter(
        (listId) => this.props.listsIsArchivedStatuses.get(listId) === false
      );
    }

    onConvertMessageToTask() {
      const spaceId = this.state.selectedSpaceId;
      const listId = this.state.selectedListId;
      const { cardName } = this.state;
      const { messageId } = this.props;
      this.props.onConvertConversationMessageToTask({
        spaceId,
        listId,
        messageId,
        cardName,
        userId: this.props.conversationWithUserId,
      });

      this.props.onConvertMessage();
      this.props.onCloseConvertMessagePopover();
    }

    onClickClosePopover() {
      this.props.onClickClosePopover();
      this.props.onCloseConvertMessagePopover();
    }

    onChangeCardName(event) {
      this.setState({ cardName: event.target.value });
    }

    onTargetButtonClick() {
      this.props.onFetchProjectListsData(this.state.selectedSpaceId);
      this.props.onClickConvertMessageButton();
      this.setState((prevState) => ({
        selectedListId: this.getListIds(prevState.selectedSpaceId).first(),
      }));
    }

    onSelectSpaceId(selectedSpaceId) {
      this.props.onFetchProjectListsData(selectedSpaceId);
      this.setState({
        selectedSpaceId,
        selectedListId: this.getListIds(selectedSpaceId).first(),
      });
    }

    onSelectListId(selectedListId) {
      this.setState({
        selectedListId,
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
      const prevFirstListId = this.getListIds(
        this.state.selectedSpaceId,
        prevProps.spacesSections
      ).first();
      const currFirstListId = this.getListIds(
        this.state.selectedSpaceId,
        this.props.spacesSections
      ).first();

      if (!prevFirstListId && prevFirstListId !== currFirstListId) {
        this.setState({
          selectedListId: currFirstListId,
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
      listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
      messageText: selectParsedMessageText(state, {
        messageId: props.messageId,
      }),
      isCurrentUserOrganizationGuest:
        selectIsCurrentUserOrganizationGuest(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onConvertConversationMessageToTask: (data) =>
      dispatch(onConvertConversationMessageToTask(data)),
    onFetchProjectListsData: (projectId) =>
      dispatch(onFetchProjectListsData(projectId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceConvertMessageToCard);
}

export default enhance;

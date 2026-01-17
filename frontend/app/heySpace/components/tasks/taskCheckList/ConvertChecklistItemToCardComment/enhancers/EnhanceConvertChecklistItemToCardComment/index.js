import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectProjectIdByTaskId, selectTaskName } from 'models/domain/TasksModel/selectors';
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector';
import { selectProjectsListIds } from 'models/domain/ListsModel/selectors';
import { selectListIsArchivedStatuses, selectTasksOrderByList } from 'models/domain/ListsModel/selectors/domain';
import { selectChecklistItemText } from 'models/domain/ChecklistsModel/selectors/domain';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { onFetchProjectListsAndTasksData } from 'models/domain/RequestModel/actions';
import { selectTaskIsArchivedStatuses } from 'models/domain/TasksModel/selectors/domain';
import * as MessagesModelActions from 'models/domain/MessagesModel/actions';
import getTaskUrl from 'utils/getTaskUrl';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

const emptyList = new List();

function enhance(ComposedComponent) {
  class EnhancedComponent extends BaseComponent {
    static propTypes = {
      checklistItemId: PropTypes.string.isRequired,
      taskId: PropTypes.string.isRequired,

      onFetchProjectListsAndTasksData: PropTypes.func.isRequired,
      onClickClosePopover: PropTypes.func.isRequired,
    };

    constructor(props) {
      super(props);

      const selectedSpaceId = this.props.spaceId || this.props.spaceIds.first();
      const selectedListId = this.getListIds(selectedSpaceId).first();
      const cardsInOrder = this.getCardIds(selectedListId, this.props.tasksOrderByListIds);

      this.state = {
        selectedSpaceId,
        selectedListId,
        selectedCardId: cardsInOrder.first(),
      };
    }

    render() {
      return (
        <ComposedComponent
          isAddCardDisabled={this.isAddCardDisabled()}
          color={this.props.color}
          spaceIds={this.props.spaceIds}
          listIds={this.getListIds(this.state.selectedSpaceId)}
          cardIds={this.getCardIds(this.state.selectedListId)}
          selectedSpaceId={this.state.selectedSpaceId}
          selectedListId={this.state.selectedListId}
          selectedCardId={this.state.selectedCardId}
          onClickClosePopover={this.props.onClickClosePopover}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onSelectCardId={this.onSelectCardId}
          onConvertToCardComment={this.onConvertToCardComment}
        />
      );
    }

    getListIds(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId) || emptyList;
      return spaceListIds.filter((listId) => this.props.listsIsArchivedStatuses.get(listId) === false);
    }

    getCardIds(selectedListId, tasksOrderByListIds = this.props.tasksOrderByListIds) {
      const cardsOrderByListId = tasksOrderByListIds.get(selectedListId);
      if (!cardsOrderByListId) {
        return emptyList;
      } else {
        return cardsOrderByListId
          .sort((a, b) => a - b)
          .keySeq()
          .toList()
          .filter((taskId) => this.props.tasksIsArchivedStatuses.get(taskId) === false);
      }
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

    onConvertToCardComment() {
      const link = `${window.location.host}${getTaskUrl(
        this.props.taskId,
        this.props.spaceId,
        ProjectPanelType.KANBAN
      )}`;
      const commentText = `Converted from task [${this.props.taskName}](${link}) checklist item: "${this.props.checklistItemText}"`;

      this.props.onClickClosePopover();
      this.props.onMessageSend(commentText, this.state.selectedCardId);
    }

    isAddCardDisabled() {
      return !this.state.selectedSpaceId && this.props.isCurrentUserOrganizationGuest;
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      const { selectedSpaceId } = this.state;
      const prevFirstListId = this.getListIds(selectedSpaceId, prevProps.spacesSections).first();
      const currFirstListId = this.getListIds(selectedSpaceId, this.props.spacesSections).first();

      if (!prevFirstListId && prevFirstListId !== currFirstListId) {
        this.setState({
          selectedListId: currFirstListId,
          selectedCardId: this.getCardIds(currFirstListId).first(),
        });
      }

      const prevFirstCardId = this.getCardIds(currFirstListId, prevProps.tasksOrderByListIds).first();
      const currFirstCardId = this.getCardIds(currFirstListId, this.props.tasksOrderByListIds).first();

      if (!prevFirstCardId && prevFirstCardId !== currFirstCardId) {
        this.setState({
          selectedCardId: currFirstCardId,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    taskName: selectTaskName(state, { taskId: props.taskId }),
    spaceId: selectProjectIdByTaskId(state, { taskId: props.taskId }),
    spaceIds: selectSortedAvailableVisibleSpacesIds(state),
    spacesSections: selectProjectsListIds(state),
    tasksOrderByListIds: selectTasksOrderByList(state),
    listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
    tasksIsArchivedStatuses: selectTaskIsArchivedStatuses(state),
    checklistItemText: selectChecklistItemText(state, {
      checklistItemId: props.checklistItemId,
    }),
    isCurrentUserOrganizationGuest: selectIsCurrentUserOrganizationGuest(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onFetchProjectListsAndTasksData: (projectId) => dispatch(onFetchProjectListsAndTasksData(projectId)),
    onMessageSend: (messageContent, objectId) => dispatch(MessagesModelActions.onMessageSend(messageContent, objectId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhancedComponent);
}

export default enhance;

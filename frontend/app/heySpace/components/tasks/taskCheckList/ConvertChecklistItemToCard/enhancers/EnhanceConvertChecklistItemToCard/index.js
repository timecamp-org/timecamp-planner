import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { List } from "immutable";
import { selectProjectIdByTaskId } from "models/domain/TasksModel/selectors";
import { selectSortedAvailableVisibleSpacesIds } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";
import { selectProjectsListIds } from "models/domain/ListsModel/selectors";
import { selectListIsArchivedStatuses } from "models/domain/ListsModel/selectors/domain";
import { selectChecklistItemText } from "models/domain/ChecklistsModel/selectors/domain";
import { onConvertChecklistItemToCard } from "models/domain/ChecklistsModel/actions";
import { selectIsCurrentUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors";
import { onFetchProjectListsData } from "models/domain/RequestModel/actions";

function enhance(ComposedComponent) {
  class EnhancedComponent extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      checklistItemId: PropTypes.string.isRequired,

      onClickClosePopover: PropTypes.func.isRequired,
      onFetchProjectListsData: PropTypes.func.isRequired,
    };

    constructor(props) {
      super(props);

      const spaceId = this.props.spaceId || this.props.spaceIds.first();

      this.state = {
        selectedSpaceId: spaceId,
        selectedListId: this.getListIds(spaceId).first(),
        listIds: this.props.spacesSections.get(spaceId),
        cardName: this.props.checklistItemText,
      };
    }

    render() {
      return (
        <ComposedComponent
          isAddCardDisabled={this.isAddCardDisabled()}
          spaceIds={this.props.spaceIds}
          listIds={this.getListIds(this.state.selectedSpaceId)}
          selectedSpaceId={this.state.selectedSpaceId}
          selectedListId={this.state.selectedListId}
          cardName={this.state.cardName}
          onClickClosePopover={this.props.onClickClosePopover}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onConvertToCard={this.onConvertToCard}
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

    onChangeCardName(event) {
      this.setState({ cardName: event.target.value });
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

    onConvertToCard() {
      this.props.onClickClosePopover();
      this.props.onConvertChecklistItemToCard(
        this.state.cardName,
        this.state.selectedListId,
        this.state.selectedSpaceId
      );
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
  }

  const mapStateToProps = (state, props) => ({
    spaceId: selectProjectIdByTaskId(state, { taskId: props.taskId }),
    spaceIds: selectSortedAvailableVisibleSpacesIds(state),
    spacesSections: selectProjectsListIds(state),
    listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
    checklistItemText: selectChecklistItemText(state, {
      checklistItemId: props.checklistItemId,
    }),
    isCurrentUserOrganizationGuest: selectIsCurrentUserOrganizationGuest(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onFetchProjectListsData: (projectId) =>
      dispatch(onFetchProjectListsData(projectId)),
    onConvertChecklistItemToCard: (cardName, listId, spaceId) =>
      dispatch(
        onConvertChecklistItemToCard(
          cardName,
          listId,
          spaceId,
          props.checklistItemId,
          props.taskId
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhancedComponent);
}

export default enhance;

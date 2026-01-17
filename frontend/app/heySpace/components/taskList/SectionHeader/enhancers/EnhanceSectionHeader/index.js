import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectProjectName } from "models/domain/ProjectsModel/selectors";
import {
  selectIsCurrentUserListOrSpaceFollower,
  selectProjectIdByListId,
  selectListFilteredEstimatedEffort,
  selectListEstimatedEffort,
  selectListFilteredTasksCount,
} from "models/domain/ListsModel/selectors";
import { selectIsExtensionEnabled } from "models/domain/ExtensionsModel/selectors/domain";
import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { ExtensionNamespace } from "models/domain/ExtensionsModel/types";
import { makeFilterId } from "models/component/FiltersModel/utils";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";
import { TaskFiltersTargetType } from "models/component/FiltersModel/types";
import { selectHasAccessToExtension } from "models/domain/SubscriptionLimitsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";
import {
  selectFilterByProperty,
  selectFiltersCount,
} from "models/component/FiltersModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceSectionHeader extends BaseComponent {
    static propTypes = {
      sectionId: PropTypes.string.isRequired,
      projectId: PropTypes.string.isRequired,
      isKanban: PropTypes.bool.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          sectionId={this.props.sectionId}
          projectId={this.props.projectId}
          projectName={this.props.projectName}
          cardsCount={this.props.cardsCount}
          sectionOptions={this.props.sectionOptions}
          isUserFollowingList={this.props.isUserFollowingList}
          hasAccessToEstimates={this.props.hasAccessToEstimates}
          isEstimatesExtensionEnabled={this.props.isEstimatesExtensionEnabled}
          listFilteredEstimatedEffort={this.props.listFilteredEstimatedEffort}
          listEstimatedEffort={this.props.listEstimatedEffort}
          shouldDisplayFilteredEstimate={this.shouldDisplayFilteredEstimate()}
          shouldRenderProjectIcon={this.props.shouldRenderProjectIcon}
          onAddCard={this.props.onAddCard}
        />
      );
    }

    shouldDisplayFilteredEstimate() {
      return (
        this.props.listEstimatedEffort !==
        this.props.listFilteredEstimatedEffort
      );
    }
  }

  function mapStateToProps(state, ownProps) {
    const projectId = selectProjectIdByListId(state, {
      listId: ownProps.sectionId,
    });
    const organizationId = selectCurrentOrganizationId(state);
    const currentUserId = selectCurrentUserId(state);
    const filterId = makeFilterId(
      currentUserId,
      ownProps.isKanban
        ? TaskFiltersTargetType.KANBAN
        : TaskFiltersTargetType.KANBAN_VERTICAL,
      projectId
    );
    const taskStatusFilter = selectFilterByProperty(state, {
      filterId,
      property: "status",
    });

    return {
      isUserFollowingList: selectIsCurrentUserListOrSpaceFollower(state, {
        listId: ownProps.sectionId,
      }),
      isEstimatesExtensionEnabled: selectIsExtensionEnabled(state, {
        organizationId,
        projectId,
        extensionNamespace: ExtensionNamespace.AGILE,
      }),
      listFilteredEstimatedEffort: selectListFilteredEstimatedEffort(state, {
        listId: ownProps.sectionId,
        projectId,
        filterId,
      }),
      listEstimatedEffort: selectListEstimatedEffort(state, {
        listId: ownProps.sectionId,
        countArchived: taskStatusFilter === "archived",
      }),
      taskStatusFilter,
      projectId,
      filtersCount: selectFiltersCount(state, { filterId }),
      projectName: selectProjectName(state, { projectId }),
      hasAccessToEstimates: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.AGILE,
      }),
      cardsCount: selectListFilteredTasksCount(state, {
        listId: ownProps.sectionId,
        projectId,
        filterId,
      }),
    };
  }

  return connect(mapStateToProps)(EnhanceSectionHeader);
}

export default Enhance;

import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import { Map } from "immutable";

import { onMoveSection } from "models/domain/TasksModel/actions";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { selectSortedAvailableVisibleSpacesIds } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";
import { onAddAlert } from "models/component/PopUpAlertsModel/actions";

import { onMoveList } from "models/domain/ListsModel/actions";
import {
  selectListIsArchivedStatuses,
  selectListIdsOrderByProjectIds,
} from "models/domain/ListsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

const emptyMap = new Map();

function enhance(ComposedComponent) {
  class EnhanceMoveSection extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      sectionId: PropTypes.string.isRequired,

      listsIsArchivedStatuses: ImmutablePropTypes.map.isRequired,
    };

    constructor(props) {
      super(props);

      let sectionsIds =
        props.projectsSectionIdsWithOrder.get(props.objectId) || emptyMap;
      // filter out archived lists & sort asc by order & get ids list
      sectionsIds = sectionsIds
        .filter((_, listId) => !props.listsIsArchivedStatuses.get(listId))
        .sort((a, b) => a - b)
        .keySeq()
        .toList();

      let selectedPosition;
      const sectionIndex = sectionsIds.indexOf(props.sectionId);
      if (sectionIndex === sectionsIds.size - 1) {
        if (sectionsIds.size !== 1) {
          selectedPosition = sectionsIds.size - 1;
        } else {
          selectedPosition = sectionsIds.size;
        }
      } else {
        selectedPosition = sectionIndex + 2;
      }

      this.state = {
        selectedSpaceId: props.objectId,
        selectedPosition,
      };
    }

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          spaceIds={this.props.spaceIds}
          selectedSpaceId={this.state.selectedSpaceId}
          selectedPosition={this.state.selectedPosition}
          color={this.props.color}
          onKeyDown={this.onKeyDown}
          onClickDropdownButton={this.onClickDropdownButton}
          onChangeSpaceId={this.onChangeSpaceId}
          onChangePosition={this.onChangePosition}
          onMoveSection={this.onMoveSection}
          onCancel={this.props.onMoveSectionCancelled}
        />
      );
    }

    onChangeSpaceId(selectedSpaceId) {
      this.setState({
        selectedSpaceId,
      });
    }

    onChangePosition(event) {
      this.setState({
        selectedPosition: event.target.value,
      });
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onMoveSection();
      } else if (event.key === "Escape") {
        this.props.onMoveSectionCancelled();
      }
    }

    onMoveSection() {
      const { sectionId, objectId } = this.props;
      const { selectedSpaceId, selectedPosition } = this.state;

      this.props.onMoveList(sectionId, selectedPosition - 1, selectedSpaceId);
      this.props.onMoveSectionDispatched();
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      spaceIds: selectSortedAvailableVisibleSpacesIds(state),
      projectsSectionIdsWithOrder: selectListIdsOrderByProjectIds(state),
      listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
      color: selectProjectColor(state, { projectId: props.objectId }),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onMoveList: (listId, selectedPosition, destinationProjectId) =>
      dispatch(onMoveList(listId, selectedPosition, destinationProjectId)),
    onMoveSection: (
      sourceSectionId,
      destinationSectionId,
      sourceProjectId,
      destinationProjectId
    ) => {
      return dispatch(
        onMoveSection(
          sourceSectionId,
          destinationSectionId,
          sourceProjectId,
          destinationProjectId
        )
      );
    },
    onAddAlert: (message) => dispatch(onAddAlert({
      humanMessage: HumanMessage({
        kind: HumanMessageKind.error,
        text: message,
      }),
    })),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMoveSection)
}

export default enhance;

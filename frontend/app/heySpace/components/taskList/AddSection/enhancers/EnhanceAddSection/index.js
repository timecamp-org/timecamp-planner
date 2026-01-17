import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EnhanceWithClickOutside from "react-click-outside";

import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'

import { selectProjectNotArchivedListIdsInOrder } from "models/domain/ListsModel/selectors";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { onCreateList } from "models/domain/ListsModel/actions";
import { onAddAlert } from "models/component/PopUpAlertsModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceAddSection extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      sectionId: PropTypes.string,
    };

    constructor(props) {
      super(props);

      const index = this.props.sectionsIds.indexOf(props.sectionId);

      this.state = {
        name: "",
        selectedPosition:
          index >= 0 ? index + 1 : this.props.sectionsIds.size + 1,
      };
    }

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          spaceIds={this.props.spaceIds}
          color={this.props.color}
          name={this.state.name}
          selectedPosition={this.state.selectedPosition}
          onChangeName={this.onChangeName}
          onChangePosition={this.onChangePosition}
          onAddSection={this.onAddSection}
          onCancel={this.props.onCancel}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    handleClickOutside() {
      this.props.onCancel();
    }

    onChangeName(event) {
      this.setState({
        name: event.target.value,
      });
    }

    onChangePosition(event) {
      this.setState({
        selectedPosition: event.target.value,
      });
    }

    onAddSection() {
      const { objectId } = this.props;
      const { name, selectedPosition } = this.state;

      const destinationSectionId = this.props.sectionsIds.get(
        selectedPosition - 1
      );

      this.props.onCreateSection(objectId, name, destinationSectionId);
      this.props.onAddSectionDispatched();
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onAddSection();
      } else if (event.key === "Escape") {
        this.props.onCancel();
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.sectionId !== this.props.sectionId) {
        const index = this.props.sectionsIds.indexOf(this.props.sectionId);

        this.setState({
          selectedPosition: index >= 0 ? index : this.props.sectionsIds.size,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      sectionsIds: selectProjectNotArchivedListIdsInOrder(state, {
        projectId: props.objectId,
      }),
      color: selectProjectColor(state, { projectId: props.objectId }),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onCreateSection: (projectId, name, destinationListId) => {
      return dispatch(
        onCreateList({
          projectId,
          name: name || "New Section",
          destinationListId,
          createBelowDestination: false,
          createAtTheBottom: destinationListId ? false : true,
        })
      );
    },
    onAddAlert: (message) => dispatch(onAddAlert({
      humanMessage: HumanMessage({
        kind: HumanMessageKind.error,
        text: message,
      }),
    })),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAddSection);
}

export default enhance;

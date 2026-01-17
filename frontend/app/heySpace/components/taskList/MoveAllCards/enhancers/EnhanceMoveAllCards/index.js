import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'

import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { onAddAlert } from "models/component/PopUpAlertsModel/actions";
import { selectProjectNotArchivedListIdsInOrder } from "models/domain/ListsModel/selectors";
import { onMoveAllTasksInList } from "models/domain/ListsModel/actions";
import { i18n } from "i18n";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceMoveAllCards extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      listId: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      let { listId } = props;
      const listIdIndex = props.listIds.indexOf(listId);
      if (listIdIndex === props.listIds.size - 1) {
        if (props.listIds.size > 1) {
          listId = props.listIds.get(listIdIndex - 1);
        }
      } else if (props.listIds.size > 1) {
        listId = props.listIds.get(listIdIndex + 1);
      }

      this.state = {
        selectedListId: listId,
      };
    }

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          listIds={this.props.listIds}
          selectedListId={this.state.selectedListId}
          color={this.props.color}
          onClickDropdownButton={this.onClickDropdownButton}
          onChangeSectionId={this.onChangeSectionId}
          onMoveAllCards={this.onMoveAllCards}
          onCancel={this.props.onMoveAllCardsCancelled}
        />
      );
    }

    onChangeSectionId(selectedListId) {
      this.setState({
        selectedListId,
      });
    }

    onMoveAllCards() {
      const { listId } = this.props;
      const { selectedListId } = this.state;

      if (listId && selectedListId) {
        this.props.onMoveAllCards(listId, selectedListId);
        this.props.onMoveAllCardsDispatched();
      } else {
        this.props.onAddAlert(i18n.t("Section not found"));
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      listIds: selectProjectNotArchivedListIdsInOrder(state, {
        projectId: props.objectId,
      }),
      color: selectProjectColor(state, { projectId: props.objectId }),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onMoveAllCards: (sourceListId, destinationListId) => dispatch(onMoveAllTasksInList(sourceListId, destinationListId)),
    onAddAlert: (message) => dispatch(onAddAlert({
      humanMessage: HumanMessage({
        kind: HumanMessageKind.error,
        text: message,
      }),
    })),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMoveAllCards)
}

export default enhance;

import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { List } from "immutable";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import EnhanceWithClickOutside from "react-click-outside";

import { selectUserSharedSpaceIdsWithCurrentUser } from "models/domain/ProjectsModel/selectors";
import * as TasksModelActions from "models/domain/TasksModel/actions";
import { selectProjectsListIds } from "models/domain/ListsModel/selectors";
import { selectListIsArchivedStatuses } from "models/domain/ListsModel/selectors/domain";
import { onFetchProjectListsData } from "models/domain/RequestModel/actions";
import { doNothing } from "common/utils";
import { selectIsCurrentUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceAddCardWithListAndSpacePicker extends BaseComponent {
    static propTypes = {
      // uses
      userId: PropTypes.string,

      // this enhancer
      spaceIds: ImmutablePropTypes.list.isRequired,
      spacesSections: ImmutablePropTypes.map.isRequired,
      onFetchProjectListsData: PropTypes.func.isRequired,
    };

    static defaultProps = {
      onSetIsFocused: doNothing,
    };

    constructor(props) {
      super(props);

      const spaceId = props.spaceId || props.spaceIds.first();
      const listIds = this.getListIds(spaceId, props.spacesSections);

      this.state = {
        isFocused: false,
        cardName: "",
        selectedSpaceId: spaceId,
        selectedListId: listIds.first(),
        listIds,
      };
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          spaceIds={this.props.spaceIds}
          selectedSpaceId={this.state.selectedSpaceId}
          onSelectSpaceId={this.onSelectSpaceId}
          cardName={this.state.cardName}
          isFocused={this.state.isFocused}
          listIds={this.getListIds(this.state.selectedSpaceId)}
          selectedListId={this.state.selectedListId}
          isAddCardDisabled={this.isAddCardDisabled()}
          onChangeCardName={this.onChangeCardName}
          onSetIsFocused={this.onSetIsFocused}
          onAddCard={this.onAddCard}
          onSelectListId={this.onSelectListId}
          onSetInputRef={this.onSetInputRef}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    inputRef = null;

    getListIds(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId) || new List();
      return spaceListIds.filter(
        (listId) => this.props.listsIsArchivedStatuses.get(listId) === false
      );
    }

    onSetInputRef(ref) {
      this.inputRef = ref;
    }

    onFocusInput() {
      if (this.inputRef) {
        this.inputRef.focus();
      }
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onAddCard();
      }
    }

    onAddCard() {
      this.props.onAddCard(
        this.state.cardName,
        this.state.selectedSpaceId,
        this.state.selectedListId
      );
      this.onSetIsFocused(false);
    }

    onChangeCardName(event) {
      this.setState({
        cardName: event.target.value,
      });
    }

    onSelectSpaceId(selectedSpaceId) {
      this.props.onFetchProjectListsData(selectedSpaceId);
      this.setState({
        selectedSpaceId,
        selectedListId: this.getListIds(selectedSpaceId).first(),
      });
    }

    onSetIsFocused(isFocused) {
      this.setState({
        isFocused,
      });

      if (!isFocused) {
        this.setState({
          cardName: "",
        });
      }

      this.props.onSetIsFocused(isFocused);
    }

    onSelectListId(selectedListId) {
      this.setState({
        selectedListId,
      });
    }

    handleClickOutside() {
      if (!this.state.cardName) {
        this.onSetIsFocused(false);
      }
    }

    isAddCardDisabled() {
      return (
        !this.state.selectedSpaceId && this.props.isCurrentUserOrganizationGuest
      );
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.userId !== prevProps.userId) {
        const spaceId = this.props.spaceId || this.props.spaceIds.first();
        const listIds = this.getListIds(spaceId);
        if (spaceId) {
          this.props.onFetchProjectListsData(spaceId);
        }
        this.setState({
          selectedSpaceId: spaceId,
          selectedListId: listIds.first(),
          listIds: listIds,
        });
      } else {
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

      if (this.state.isFocused && !prevState.isFocused) {
        this.onFocusInput();
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      spaceIds: selectUserSharedSpaceIdsWithCurrentUser(state, {
        userId: props.userId,
      }),
      spacesSections: selectProjectsListIds(state),
      listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
      isCurrentUserOrganizationGuest:
        selectIsCurrentUserOrganizationGuest(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onAddCard: (name, selectedSpaceId, selectedListId) =>
      dispatch(
        TasksModelActions.onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard(
          selectedSpaceId,
          selectedListId,
          props.userId,
          name
        )
      ),
    onFetchProjectListsData: (projectId) =>
      dispatch(onFetchProjectListsData(projectId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceAddCardWithListAndSpacePicker);
}

export default enhance;

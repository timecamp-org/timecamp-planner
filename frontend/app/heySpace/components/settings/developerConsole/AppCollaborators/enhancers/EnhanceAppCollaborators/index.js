import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { doNothing } from "common/utils";

import { selectAppUserIds } from "models/domain/UserAppsModel/selectors/domain";
import {
  selectIsCurrentUserAppOwner,
  selectAppNotAssignedUserIds,
} from "models/domain/UserAppsModel/selectors";
import {
  onInviteCollaborator,
  onRemoveCollaborator,
} from "models/domain/UserAppsModel/actions";
import {
  selectUsersSearchName,
  selectCurrentUserId,
} from "models/domain/UsersModel/selectors/domain";
import isEmpty from "lodash/isEmpty";

import BaseComponent from "commonEnhancers/BaseComponent";
import { List } from "immutable";
import fuzzysearch from "fuzzysearch";

const emptyList = new List();

function Enhance(ComposedComponent) {
  class EnhanceAppCollaborators extends BaseComponent {
    static propTypes = {
      appId: PropTypes.string.isRequired,
      onLeaveAppCollaborators: PropTypes.func,
    };

    static defaultProps = {
      onLeaveAppCollaborators: doNothing,
    };

    state = {
      isCollaboratorsPickerOpen: false,
      searchPhrase: "",
      filteredUserIds: this.props.userIds,
      filteredNotAssignedUserIds: this.props.notAssignedUserIds,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          appId={this.props.appId}
          userIds={this.props.userIds}
          isCurrentUserAppOwner={this.props.isCurrentUserAppOwner}
          filteredUserIds={this.state.filteredUserIds}
          notAssignedUserIds={this.state.filteredNotAssignedUserIds}
          isCollaboratorsPickerOpen={this.state.isCollaboratorsPickerOpen}
          searchPhrase={this.state.searchPhrase}
          shouldRenderInvitationContent={this.shouldRenderInvitationContent()}
          onOpenCollaboratorsPicker={this.onOpenCollaboratorsPicker}
          onCloseCollaboratorsPicker={this.onCloseCollaboratorsPicker}
          onChangeSearchPhrase={this.onChangeSearchPhrase}
          onInviteCollaborator={this.onInviteCollaborator}
          onKeyDown={this.onKeyDown}
          onLeaveAppCollaborators={this.onLeaveAppCollaborators}
        />
      );
    }

    onOpenCollaboratorsPicker() {
      this.setState({ isCollaboratorsPickerOpen: true });
    }

    onCloseCollaboratorsPicker() {
      this.setState({ isCollaboratorsPickerOpen: false });
    }

    resetSearchPhrase() {
      this.setState({
        searchPhrase: "",
        filteredUserIds: this.props.userIds,
        filteredNotAssignedUserIds: this.props.notAssignedUserIds,
      });
    }

    onChangeSearchPhrase(event) {
      const searchPhrase = event.target.value;
      const filteredUserIds = this.getFilteredUserIds(searchPhrase);
      const filteredNotAssignedUserIds =
        this.getFilteredNotAssignedUserIds(searchPhrase);

      this.setState({
        searchPhrase,
        filteredUserIds,
        filteredNotAssignedUserIds,
      });
    }

    getFilteredUserIds(searchPhrase) {
      let result = emptyList;

      this.props.userIds.forEach((userId) => {
        const name = this.props.usersSearchName.get(userId) || "";

        if (fuzzysearch(searchPhrase.toLowerCase(), name.toLowerCase())) {
          result = result.push(userId);
        }
      });

      return result;
    }

    getFilteredNotAssignedUserIds(searchPhrase) {
      let result = emptyList;

      this.props.notAssignedUserIds.forEach((userId) => {
        const name = this.props.usersSearchName.get(userId) || "";

        if (fuzzysearch(searchPhrase.toLowerCase(), name.toLowerCase())) {
          result = result.push(userId);
        }
      });

      return result;
    }

    onKeyDown(event) {
      if (event.key === "Enter" && this.shouldRenderInvitationContent()) {
        this.onInviteCollaborator();
      }
    }

    shouldRenderInvitationContent() {
      return (
        this.state.filteredUserIds.size === 0 &&
        this.state.filteredNotAssignedUserIds.size === 0 &&
        this.state.searchPhrase.length > 0 &&
        this.props.isCurrentUserAppOwner
      );
    }

    onInviteCollaborator() {
      this.resetSearchPhrase();
      this.props.onInviteCollaborator(this.state.searchPhrase);
    }

    onLeaveAppCollaborators() {
      this.props.onRemoveCollaborator(this.props.currentUserId);
      this.props.onLeaveAppCollaborators();
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      const newState = {};
      const { searchPhrase } = this.state;
      if (prevProps.userIds.size !== this.props.userIds.size) {
        newState.filteredUserIds = this.getFilteredUserIds(searchPhrase);
      }

      if (
        prevProps.notAssignedUserIds.size !== this.props.notAssignedUserIds.size
      ) {
        newState.filteredNotAssignedUserIds =
          this.getFilteredNotAssignedUserIds(searchPhrase);
      }

      if (!isEmpty(newState)) {
        this.setState({
          ...newState,
        });
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      currentUserId: selectCurrentUserId(state),
      userIds: selectAppUserIds(state, { appId: props.appId }),
      notAssignedUserIds: selectAppNotAssignedUserIds(state, {
        appId: props.appId,
      }),
      usersSearchName: selectUsersSearchName(state),
      isCurrentUserAppOwner: selectIsCurrentUserAppOwner(state, {
        appId: props.appId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onInviteCollaborator: (searchPhrase) =>
        dispatch(onInviteCollaborator(props.appId, searchPhrase)),
      onRemoveCollaborator: (userId) =>
        dispatch(onRemoveCollaborator(props.appId, userId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAppCollaborators);
}

export default Enhance;

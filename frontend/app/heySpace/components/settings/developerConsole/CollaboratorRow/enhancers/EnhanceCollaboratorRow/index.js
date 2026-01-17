import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  onAddCollaborator,
  onRemoveCollaborator,
} from "models/domain/UserAppsModel/actions";

import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";

import { selectIsCurrentUserAppOwner } from "models/domain/UserAppsModel/selectors";

import { selectUserInAppRole } from "models/domain/UserAppsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceCollaboratorRow extends BaseComponent {
    static propTypes = {
      appId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    };

    state = {
      isCollaboratorsPickerOpen: false,
      searchPhrase: "",
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isAssigned={this.props.isAssigned}
          userId={this.props.userId}
          userRole={this.props.userRole}
          isCurrentUserAppOwner={this.props.isCurrentUserAppOwner}
          currentUserId={this.props.currentUserId}
          onAddCollaborator={this.props.onAddCollaborator}
          onRemoveCollaborator={this.props.onRemoveCollaborator}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      userRole: selectUserInAppRole(state, {
        appId: props.appId,
        userId: props.userId,
      }),
      isCurrentUserAppOwner: selectIsCurrentUserAppOwner(state, {
        appId: props.appId,
      }),
      currentUserId: selectCurrentUserId(state),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onAddCollaborator: () =>
        dispatch(onAddCollaborator(props.appId, props.userId)),
      onRemoveCollaborator: () =>
        dispatch(onRemoveCollaborator(props.appId, props.userId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCollaboratorRow);
}

export default Enhance;

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import {
  selectCurrentOrganizationName,
  selectCurrentOrganizationId,
} from "models/domain/OrganizationsModel/selectors/domain";
import { selectIsCurrentUserOrganizationAdmin } from "models/domain/OrganizationsModel/selectors";
import * as OrganizationsModelActions from "models/domain/OrganizationsModel/actions";

export default function enhance(Component) {
  class EnhanceWorkspaceNameInput extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      required: PropTypes.bool,
      label: PropTypes.string,
      autoFocus: PropTypes.bool,
      maxLength: PropTypes.number,

      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onKeyDown: PropTypes.func,
      onKeyUp: PropTypes.func,
    };

    static defaultProps = {
      onFocus: doNothing,
      onBlur: doNothing,
      onKeyDown: doNothing,
      onKeyUp: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        workspaceName: props.workspaceName || "",
        workspaceNameHumanMessageModel: null,
        isHovering: false,
      };
    }

    render() {
      return (
        <Component
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          workspaceName={this.state.workspaceName}
          required={this.props.required}
          label={this.props.label}
          maxLength={this.props.maxLength}
          autoFocus={this.props.autoFocus}
          workspaceNameHumanMessageModel={
            this.state.workspaceNameHumanMessageModel
          }
          isDisabled={!this.props.isCurrentUserWorkspaceAdmin}
          isHovering={this.state.isHovering}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onUpdate={this.onUpdateWorkspaceName}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    onUpdateWorkspaceName(event) {
      if (!this.props.isCurrentUserWorkspaceAdmin) {
        return null;
      }
      const text = event.target.value;

      if (!text) {
        this.setState({
          workspaceNameHumanMessageModel: null,
        });
      } else {
        // ok
      }

      this.setState({
        workspaceName: text,
      });
      this.props.onUpdateWorkspaceName(this.props.currentOrganizationId, text);
    }

    onWorkspaceNameInvalid(text) {
      this.setState({
        workspaceNameHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onFocus(event) {
      const text = event.target.value;
      this.setState({ workspaceName: text });
      this.props.onFocus();
    }

    onBlur(event) {
      if (!this.props.isCurrentUserWorkspaceAdmin) {
        return null;
      }
      const text = event.target.value;
      this.setState({
        workspaceNameHumanMessageModel: null,
      });

      if (text && text.length > 0 && this.props.isCurrentUserWorkspaceAdmin) {
        this.props.onUpdateWorkspace(this.props.currentOrganizationId, {
          name: text,
        });
        this.props.onBlur();
      } else {
        this.onWorkspaceNameInvalid("Enter workspace name");
      }
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }

    componentDidUpdate(prevProps) {
      if (prevProps.workspaceName !== this.props.workspaceName) {
        this.setState({ workspaceName: this.props.workspaceName });
      }
    }
  }

  const mapStateToProps = (state) => ({
    workspaceName: selectCurrentOrganizationName(state),
    currentOrganizationId: selectCurrentOrganizationId(state),
    isCurrentUserWorkspaceAdmin: selectIsCurrentUserOrganizationAdmin(state),
  });

  function mapDispatchToProps(dispatch) {
    return {
      onUpdateWorkspaceName: (organizationId, workspaceName) =>
        dispatch(
          OrganizationsModelActions.onUpdateWorkspaceName(
            organizationId,
            workspaceName
          )
        ),
      onUpdateWorkspace: (organizationId, fields) =>
        dispatch(
          OrganizationsModelActions.onUpdateWorkspace(
            organizationId,
            fields,
            true
          )
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceWorkspaceNameInput);
}

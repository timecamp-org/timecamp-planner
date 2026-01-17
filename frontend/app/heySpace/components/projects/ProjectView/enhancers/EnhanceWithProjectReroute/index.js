import React from "react";
import { connect } from "react-redux";

import {
  selectProjectIsGroupChat,
  selectProjectIdByObjectId,
} from "models/domain/ProjectsModel/selectors";

import { ProjectPanelType } from "models/domain/ProjectsSettingsModel/types";

import BaseComponent from "commonEnhancers/BaseComponent";
import { getLastOpenedPanel } from "../../../../../utils/lastOpenedPanelController";

export default function enhance(Component) {
  class EnhanceWithProjectReroute extends BaseComponent {
    render() {
      return <Component {...this.props} />;
    }

    isKanban() {
      return this.props.location.pathname.includes(
        `/${ProjectPanelType.KANBAN}`
      );
    }

    getPanelDomain() {
      if (this.props.isConversation) {
        return "conversations";
      } else {
        return "projects";
      }
    }

    getPanelType() {
      if (this.props.isGroupChat) {
        return "members";
      } else {
        return "tasks";
      }
    }

    onRedirectToPanel() {
      const lastPanelType = getLastOpenedPanel(this.props.projectId);
      const panelDomain = this.getPanelDomain();
      switch (lastPanelType) {
        case ProjectPanelType.KANBAN: {
          if (!this.isKanban()) {
            this.props.history.replace(
              `/${panelDomain}/${this.props.objectId}/${ProjectPanelType.KANBAN}`
            );
          }
          break;
        }
        case ProjectPanelType.CALENDAR: {
          this.props.history.replace(
            `/${panelDomain}/${this.props.objectId}/${ProjectPanelType.CALENDAR}`
          );
          break;
        }
        case ProjectPanelType.TIMELINE: {
          this.props.history.replace(
            `/${panelDomain}/${this.props.objectId}/${ProjectPanelType.TIMELINE}`
          );
          break;
        }
        case ProjectPanelType.LIST: {
          this.props.history.replace(
            `/${panelDomain}/${this.props.objectId}/${ProjectPanelType.LIST}`
          );
          break;
        }
        case ProjectPanelType.CHAT: {
          this.props.history.replace(
            `/${panelDomain}/${this.props.objectId}/${
              ProjectPanelType.CHAT
            }/${this.getPanelType()}`
          );
          break;
        }
        default: {
          this.props.history.replace(
            `/${panelDomain}/${this.props.objectId}/${
              ProjectPanelType.CHAT
            }/${this.getPanelType()}`
          );
          break;
        }
      }
    }

    componentDidUpdate() {
      if (!this.props.match.params.projectPanelType) {
        this.onRedirectToPanel();
      }
    }

    componentDidMount() {
      if (!this.props.match.params.projectPanelType) {
        this.onRedirectToPanel();
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const objectId = props.match.params.projectId;
    const projectId = selectProjectIdByObjectId(state, { objectId });

    return {
      projectId,
      objectId,
      isGroupChat: selectProjectIsGroupChat(state, { projectId }),
    };
  };

  return connect(mapStateToProps)(EnhanceWithProjectReroute);
}

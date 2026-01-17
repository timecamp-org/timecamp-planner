import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import * as RequestModelSelectors from "models/domain/RequestModel/selectors";
import { selectProjectViewRequestIsLoading } from "models/domain/RequestModel/selectors/projectViewRequest";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";

import {
  selectHasAccessToProject,
  selectProjectIdByConversationId,
} from "models/domain/ProjectsModel/selectors";
import getDefaultAppUrl from "../../utils/getDefaultAppUrl";
import * as RequestTypesConstants from "models/domain/RequestModel/constants/requestTypes";
import { FIRST_PROJECT_NAME } from "models/domain/ProjectsModel/constants";
import { selectFirstProjectData } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";
import { projectWithPeopleRequestType } from "models/domain/ProjectsModel/requestQueryParams";

export default function enhance(Component) {
  class EnhanceWithUserProjectAccess extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      isConversation: PropTypes.bool.isRequired,
    };

    render() {
      return (
        <Component
          {...this.props}
          hasAccessToProject={this.hasAccessToProject()}
        />
      );
    }

    hasAccessToProject() {
      const {
        isCurrentUserInProject,
        isLoadingProject,
        isLoadingConversation,
        isLoadingUserInitialData,
        isLoadingCreateConversation,
      } = this.props;

      return (
        isCurrentUserInProject ||
        isLoadingCreateConversation ||
        isLoadingProject ||
        isLoadingConversation ||
        isLoadingUserInitialData
      );
    }

    onRedirectToDefaultUrl() {
      const { firstProjectData } = this.props;
      const appUrl = getDefaultAppUrl({ firstProjectData });
      this.props.history.push(appUrl);
    }

    shouldRedirectToDefaultUrl() {
      const { objectId, firstProjectData, isCurrentUserInProject } = this.props;
      return (
        objectId === FIRST_PROJECT_NAME &&
        firstProjectData &&
        isCurrentUserInProject
      );
    }

    componentDidUpdate() {
      if (this.shouldRedirectToDefaultUrl()) {
        this.onRedirectToDefaultUrl();
      }
    }

    componentDidMount() {
      if (this.shouldRedirectToDefaultUrl()) {
        this.onRedirectToDefaultUrl();
      }
    }
  }

  const mapStateToProps = (state, props) => {
    let isCurrentUserInProject = false;
    const { objectId, isConversation } = props;

    const projectId = isConversation
      ? selectProjectIdByConversationId(state, { conversationId: objectId })
      : objectId;

    const currentUserId = selectCurrentUserId(state);

    isCurrentUserInProject = selectHasAccessToProject(state, { projectId });
    if (objectId === FIRST_PROJECT_NAME) {
      isCurrentUserInProject = true;
    }

    return {
      isCurrentUserInProject,
      objectId,
      firstProjectData: selectFirstProjectData(state),
      isLoadingConversation: RequestModelSelectors.selectRequestIsLoading(
        state,
        {
          requestType: RequestTypesConstants.getConversationViewData,
          objectId: projectId,
        }
      ),
      isLoadingProject:
        selectProjectViewRequestIsLoading(state, { projectId }) ||
        !RequestModelSelectors.selectIsRequestFinished(state, {
          requestType: projectWithPeopleRequestType,
          objectId: projectId,
        }),
      isLoadingUserInitialData: !RequestModelSelectors.selectRequestIsSuccess(
        state,
        {
          requestType: RequestTypesConstants.getUserInitialData,
          objectId: currentUserId,
        }
      ),
      isLoadingCreateConversation: RequestModelSelectors.selectRequestIsLoading(
        state,
        {
          requestType: RequestTypesConstants.createConversationIfDoesNotExist,
          objectId,
        }
      ),
    };
  };

  return connect(mapStateToProps)(EnhanceWithUserProjectAccess);
}

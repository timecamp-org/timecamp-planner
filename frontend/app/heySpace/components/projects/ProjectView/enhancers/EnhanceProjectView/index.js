import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { List } from 'immutable';
import React from 'react';

import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRefreshData from 'commonEnhancers/EnhanceWithRefreshData';

import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  onFetchProject,
  onSetIsConversationVisible,
  onSetProjectLatestVisit,
} from 'models/domain/ProjectsModel/actions';
import {
  FIRST_PROJECT_NAME,
  FIRST_PROJECT_PLACEHOLDER_PATH,
} from 'models/domain/ProjectsModel/constants';
import {
  selectConversationPeople,
  selectIsProjectWithIdExist,
  selectProjectIdByConversationId,
} from 'models/domain/ProjectsModel/selectors';
import {
  ObjectResourceType,
  ProjectMetadataType,
  ProjectType,
} from 'models/domain/ProjectsModel/types';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes';
import { getProject } from 'models/domain/RequestModel/constants/requestTypes';
import { generateCreateProjectRequestId } from 'models/domain/RequestModel/createRequestId';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import {
  selectIsRequestRepeatable,
  selectRequestStatus,
} from 'models/domain/RequestModel/selectors';
import { RequestStatus } from 'models/domain/RequestModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

const projectQueryParams = { metadata: [ProjectMetadataType.PEOPLE] };

export default function enhance(Component) {
  @EnhanceWithRouter()
  @EnhanceWithRefreshData({
    action: onFetchProject,
    paramsToInject: [
      { key: 'projectId' },
      { key: 'queryParams', defaultValue: projectQueryParams },
    ],
  })
  class EnhanceProjectView extends BaseComponent {
    state = {
      objectIds: new List([this.props.objectId]),
      prevProjectId: this.props.projectId,
    };

    render() {
      return (
        <Component
          match={this.props.match}
          history={this.props.history}
          location={this.props.location}
          objectId={this.props.objectId}
          isConversation={this.props.isConversation}
          isChat={this.isChat()}
          isKanban={this.isKanban()}
          isLoading={this.props.isLoading}
          isFailure={this.props.isFailure}
          isProjectExist={this.props.isProjectExist}
          projectPanelType={this.props.match.params.projectPanelType}
          rightPanelType={this.props.match.params.rightPanelType}
          objectIds={this.state.objectIds}
          shouldRenderFirstProjectPlaceholder={this.shouldRenderFirstProjectPlaceholder()}
        />
      );
    }

    isChat() {
      return this.props.location.pathname.includes(`/${ProjectPanelType.CHAT}`);
    }

    isKanban() {
      return this.props.location.pathname.includes(
        `/${ProjectPanelType.KANBAN}`
      );
    }

    shouldRenderFirstProjectPlaceholder() {
      return this.props.location.pathname === FIRST_PROJECT_PLACEHOLDER_PATH;
    }

    static getDerivedStateFromProps(props, state) {
      let newState = null;

      if (state.prevProjectId !== props.projectId) {
        newState = newState || {};
        newState.prevProjectId = props.projectId;
      }

      return newState;
    }

    onFetchProject() {
      const { isProjectRequestRepeatable, projectId } = this.props;
      if (
        isProjectRequestRepeatable &&
        projectId &&
        projectId !== FIRST_PROJECT_NAME
      ) {
        this.props.onFetchProject(projectId);
      }
    }

    componentDidUpdate(prevProps) {
      const currentObjectId = this.props.match.params.projectId;
      const prevObjectId = prevProps.match.params.projectId;

      if (
        currentObjectId !== prevObjectId ||
        prevProps.projectId !== this.props.projectId
      ) {
        if (
          this.props.entityType === EntityType.PROJECT_DATA &&
          this.props.isConversation
        ) {
          this.props.onSetIsConversationVisible(currentObjectId, true);
        }

        this.onFetchProject();
      }

      if (
        this.props.currentOrganizationId !== prevProps.currentOrganizationId
      ) {
        this.props.history.push(`/projects/${FIRST_PROJECT_NAME}`);
      }

      if (
        this.props.projectId !== prevProps.projectId &&
        this.props.projectId &&
        this.props.projectId !== FIRST_PROJECT_NAME
      ) {
        this.props.onSetProjectLatestVisit(this.props.projectId);
      }
    }

    componentDidMount() {
      this.onFetchProject();

      const { projectId } = this.props;
      if (projectId && projectId !== FIRST_PROJECT_NAME) {
        this.props.onSetProjectLatestVisit(projectId);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const objectId = props.match.params.projectId;
    const { objectType } = props.match.params;
    const isConversation = objectType === ObjectResourceType.CONVERSATIONS;

    const currentUserId = selectCurrentUserId(state);
    const people = selectConversationPeople(state, {
      conversationId: objectId,
    });
    const currentOrganizationId = selectCurrentOrganizationId(state);

    const projectId = isConversation
      ? selectProjectIdByConversationId(state, { conversationId: objectId })
      : objectId;

    const inviteRequestStatus = selectRequestStatus(state, {
      requestType: RequestTypes.inviteUsersToConversations,
      objectId,
    });

    const projectType = isConversation
      ? people.size > 2
        ? ProjectType.GROUP_CHAT
        : ProjectType.DIRECT_CHAT
      : ProjectType.PROJECT;
    const projectRequestId = generateCreateProjectRequestId(
      currentUserId,
      projectId || objectId,
      projectType,
      people,
      currentOrganizationId
    );
    const createProjectStatus = selectRequestStatus(state, {
      requestType: RequestTypes.createProject,
      objectId: projectRequestId,
    });

    const isLoading = [inviteRequestStatus, createProjectStatus].some(
      (status) => status === RequestStatus.LOADING
    );

    const isFailure = [inviteRequestStatus, createProjectStatus].some(
      (status) => status === RequestStatus.FAILURE
    );

    const requestType = getRequestTypeWithParams(
      getProject,
      projectQueryParams
    );

    return {
      objectId,
      projectId,
      currentOrganizationId,
      isProjectExist: selectIsProjectWithIdExist(state, { projectId }),
      isLoading,
      isFailure,
      isConversation,
      entityType: selectEntityType(state, { entityId: projectId }),
      isProjectRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType,
        objectId: projectId,
      }),
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      onSetIsConversationVisible: (conversationId, isVisible) =>
        dispatch(onSetIsConversationVisible(conversationId, isVisible)),
      onFetchProject: (projectId) =>
        dispatch(onFetchProject(projectId, projectQueryParams)),
      onSetProjectLatestVisit: (projectId) =>
        dispatch(onSetProjectLatestVisit(projectId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceProjectView);
}

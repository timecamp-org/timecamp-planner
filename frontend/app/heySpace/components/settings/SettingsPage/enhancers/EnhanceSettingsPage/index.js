import React from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'commonEnhancers/BaseComponent';

import {
  selectCurrentOrganizationId,
  selectCurrentOrganizationName,
} from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectCurrentPathname,
  selectPreviousPathname,
} from 'models/domain/RouterModel/selectors';
import { onFetchCurrentUserOrganizationRoles } from 'models/domain/OrganizationsModel/actions';
import { selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors';
import {
  getUserOrganizationRoles,
} from 'models/domain/RequestModel/constants/requestTypes';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import {
  selectIsTagsSettingsAvailable,
  selectIsAddonsSettingsAvailable,
} from 'models/domain/PermissionsModel/selectors';
import { getOrganizationProjects } from 'models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import {
  ProjectMetadataType,
  ProjectType,
} from 'models/domain/ProjectsModel/types';
import { onGetOrganizationProjects } from 'models/domain/ProjectsModel/actions';
import EnhanceWithRefreshData from '../../../../../../common/enhancers/EnhanceWithRefreshData';
import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';
import { BaseQueryFieldValue } from '../../../../../../common/types';

const defaultPathname = '/';

const projectsQueryParams = {
  metadata: [ProjectMetadataType.CUSTOM_FIELDS, ProjectMetadataType.PEOPLE],
  projectType: ProjectType.PROJECT,
  fields: ['id', 'name', 'status', 'organizationId'],
  isMember: BaseQueryFieldValue.ALL,
};

function EnhanceSettingsPage(ComposedComponent) {
  @EnhanceWithRouter()
  @EnhanceWithRefreshData({
    action: onGetOrganizationProjects,
    paramsToInject: [{ key: 'params', defaultValue: projectsQueryParams }],
  })
  class EnhanceSettingsPage extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onGoBack={this.onGoBack}
          isWorkspaceSettingsVisible={this.props.isWorkspaceSettingsAvailable}
          isTagsSettingsVisible={this.props.isTagsSettingsAvailable}
          isAddonsVisible={this.props.isAddonsSettingsAvailable}
        />
      );
    }

    onGoBack() {
      this.props.history.push(this.previousPathname || defaultPathname);
    }


    componentDidMount() {
      if (
        this.props.previousPathname &&
        this.props.previousPathname.includes('/project')
      ) {
        this.previousPathname = this.props.previousPathname;
      }

      if (this.props.isOrganizationRoleRequestRepeatable) {
        this.props.onFetchCurrentUserOrganizationRoles();
      }
      if (this.props.isProjectsRequestRepeatable) {
        this.props.onGetProjectsExtensionsData();
      }
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.currentOrganizationId !== this.props.currentOrganizationId
      ) {
        this.previousPathname = defaultPathname;
        this.props.onFetchCurrentUserOrganizationRoles();
      }
    }
  }

  function mapStateToProps(state) {
    const currentOrganizationId = selectCurrentOrganizationId(state);
    const currentUserId = selectCurrentUserId(state);
    const projectsRequestType = getRequestTypeWithParams(
      getOrganizationProjects,
      projectsQueryParams
    );
    return {
      currentOrganizationId,
      currentUserId,
      workspaceName: selectCurrentOrganizationName(state),
      currentPathname: selectCurrentPathname(state),
      previousPathname: selectPreviousPathname(state),
      isWorkspaceSettingsAvailable: selectIsCurrentUserOrganizationAdmin(state),
      isTagsSettingsAvailable: selectIsTagsSettingsAvailable(state),
      isAddonsSettingsAvailable: selectIsAddonsSettingsAvailable(state),
      isOrganizationRoleRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType: getUserOrganizationRoles,
        objectId: currentUserId,
      }),
      isProjectsRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType: projectsRequestType,
        objectId: currentOrganizationId,
      }),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onFetchCurrentUserOrganizationRoles: () =>
        dispatch(onFetchCurrentUserOrganizationRoles()),
      onGetProjectsExtensionsData: () =>
        dispatch(onGetOrganizationProjects(projectsQueryParams)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSettingsPage);
}

export default EnhanceSettingsPage;

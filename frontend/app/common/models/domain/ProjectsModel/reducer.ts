import { fromJS, List } from 'immutable';

import * as C from './constants';

import { Id } from 'common/utils/identifier';
import {
  filterList,
  mergeIfExists,
  mergeObjectLists,
  recordMergerFactory,
  updateListWithNewItem,
} from 'common/utils/immutableUtils';
import { Reducer } from 'redux';
import { PayloadAction } from '../../../types';
import * as AppModelConstants from '../AppModel/constants';
import * as CurrentUserConstants from '../CurrentUserModel/constants';
import * as RequestModelConstants from '../RequestModel/constants';
import { OrganizationProjectsData, ProjectsState } from './types';

const emptyList = List();

const projectBasicDataKeys = ['id', 'name'];
const projectRecordMerger = recordMergerFactory(projectBasicDataKeys);

const cleanInitialState: ProjectsState = fromJS({
  projectsData: {},
  projectPeople: {},
  projectPeopleRole: {},
  projectFollowerIds: {},
  projectOrganizationIds: {},
  sectionsScrollTop: {},
  kanbanScrollLeft: {},
  isConversationVisible: {},
  projectsHaveUnreadMessages: {},
  projectFileIds: {},
  firstProjectIds: {},
});

const reducer: Reducer<ProjectsState, PayloadAction> = (
  state: ProjectsState = cleanInitialState,
  action: PayloadAction
): ProjectsState => {
  switch (action.type) {
    case C.onProjectCreateSuccess: {
      const { projectId, project, projectPeople, projectPeopleRole, projectFollowerIds, organizationId } =
        action.payload.data;
      return state
        .setIn(['projectsData', projectId], project)
        .setIn(['projectPeople', projectId], projectPeople)
        .setIn(['projectPeopleRole', projectId], projectPeopleRole)
        .setIn(['projectFollowerIds', projectId], projectFollowerIds)
        .setIn(['projectOrganizationIds', projectId], organizationId);
    }

    case C.onGetOrganizationProjectsSuccess:
      const { projectsData, projectPeople, projectPeopleRole, projectsHaveUnreadMessages, organizationIdByProjectId } =
        action.payload as OrganizationProjectsData;
      return state
        .set('projectsData', state.get('projectsData').mergeDeepWith(projectRecordMerger, projectsData))
        .set('projectPeople', mergeIfExists(state.get('projectPeople'), projectPeople, true))
        .set('projectPeopleRole', mergeIfExists(state.get('projectPeopleRole'), projectPeopleRole))
        .set(
          'projectsHaveUnreadMessages',
          mergeIfExists(state.get('projectsHaveUnreadMessages'), projectsHaveUnreadMessages)
        )
        .set('projectOrganizationIds', state.get('projectOrganizationIds').merge(organizationIdByProjectId));

    case C.onProjectUpdateSuccess:
      return state.setIn(['projectsData', action.payload.data.projectId], action.payload.data.project);

    case C.onNameUpdate:
      return state.setIn(['projectsData', action.payload.projectId, 'name'], action.payload.name);

    case C.onStatusUpdate:
      return state.setIn(['projectsData', action.payload.projectId, 'status'], action.payload.status);

    case C.onDescriptionUpdate:
      return state.setIn(['projectsData', action.payload.projectId, 'description'], action.payload.description);

    case C.onColorUpdate:
      return state.setIn(['projectsData', action.payload.projectId, 'color'], action.payload.color);

    case C.onIconTypeUpdate:
      return state.setIn(['projectsData', action.payload.projectId, 'iconType'], action.payload.iconType);

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return cleanInitialState;

    case C.onBatchProjects:
      return state
        .set('projectsData', state.get('projectsData').merge(action.payload.projectsData))
        .set(
          'projectOrganizationIds',
          state.get('projectOrganizationIds').merge(action.payload.projectOrganizationIds)
        );

    case C.onCreateProjectData:
      return state
        .setIn(['projectsData', action.payload.project.id], action.payload.project)
        .setIn(['projectOrganizationIds', action.payload.project.id], action.payload.organizationId);

    case C.onBatchOrganizationIdByProjectId:
      return state.set(
        'projectOrganizationIds',
        state.get('projectOrganizationIds').merge(action.payload.organizationIdByProjectId)
      );

    case C.onSetOrganizationIdByProjectId:
      return state.setIn(['projectOrganizationIds', action.payload.projectId], action.payload.organizationId);

    case C.onUpdateProjectData:
      const { project } = action.payload;
      return state.mergeIn(['projectsData', project.id], project);

    case C.onBatchProjectsPeopleIds:
      return state.set('projectPeople', mergeObjectLists(state.get('projectPeople'), action.payload.projectPeople));

    case C.onCreateProjectPeopleIds:
      return state.setIn(['projectPeople', action.payload.projectId], action.payload.projectPeople);

    case C.onUpdateProjectPeopleIds:
      return state.setIn(['projectPeople', action.payload.projectId], action.payload.projectPeople);

    case C.onUpdateProjectPeople:
    case C.onUpdateProjectPeopleSuccess:
      return state
        .setIn(['projectPeople', action.payload.projectId], action.payload.projectPeopleIds)
        .setIn(['projectPeopleRole', action.payload.projectId], action.payload.projectPeopleRole);

    case C.onBatchProjectsPeopleRole:
      return state.set('projectPeopleRole', state.get('projectPeopleRole').merge(action.payload.projectPeopleRole));

    case C.onCreateProjectPeopleRole:
      return state.setIn(['projectPeopleRole', action.payload.projectId], action.payload.projectPeopleRole);

    case C.onUpdateProjectPeopleRole:
      return state.setIn(['projectPeopleRole', action.payload.projectId], action.payload.projectPeopleRole);

    case C.onUpdateProjectFollowerIds: {
      return state.setIn(['projectFollowerIds', action.payload.projectId], action.payload.projectFollowerIds);
    }

    case C.onFetchProjectSuccess: {
      const { project, peopleIds, peopleRole } = action.payload;
      const currentProject = state.getIn(['projectsData', project.id]);
      const currentPeopleIds = state.getIn(['projectPeople', project.id]);
      const currentPeopleRole = state.getIn(['projectPeopleRole', project.id]);

      return state
        .setIn(
          ['projectsData', project.id],
          currentProject ? currentProject.mergeDeepWith(projectRecordMerger, project) : project
        )
        .setIn(['projectPeople', project.id], peopleIds || currentPeopleIds)
        .setIn(['projectPeopleRole', project.id], peopleRole || currentPeopleRole)
        .setIn(['projectOrganizationIds', project.id], project.organizationId);
    }

    case C.onAddProjectFollower: {
      const { userId, projectId } = action.payload;
      return state.updateIn(['projectFollowerIds', projectId], updateListWithNewItem<Id>(userId));
    }

    case C.onRemoveProjectFollower: {
      const { userId, projectId } = action.payload;
      return state.updateIn(['projectFollowerIds', projectId], (projectFollowerIds = emptyList as List<Id>) =>
        filterList<Id>(projectFollowerIds, userId)
      );
    }

    case C.onAddProjectPerson:
    case C.onUpdateProjectPerson: {
      const { projectId, userId, role } = action.payload;
      let newState = state;

      newState = newState.updateIn(['projectPeople', projectId], updateListWithNewItem<Id>(userId));

      if (role) {
        newState = newState.setIn(['projectPeopleRole', projectId, userId], role);
      }
      return newState;
    }

    case RequestModelConstants.onFetchProjectViewDataSuccess: {
      const {
        data: { projectFollowerIds },
        projectId,
      } = action.payload;
      const currentFollowerIds = state.getIn(['projectFollowerIds', projectId]) || emptyList;
      return state.setIn(['projectFollowerIds', projectId], currentFollowerIds.merge(projectFollowerIds));
    }
    case RequestModelConstants.onFetchConversationViewDataSuccess: {
      const {
        data: { projectsFollowerIds },
      } = action.payload;
      return state.set('projectFollowerIds', state.get('projectFollowerIds').mergeDeep(projectsFollowerIds));
    }

    case C.onUpdateProjectPrivacy:
      return state.setIn(['projectsData', action.payload.projectId, 'isPrivate'], action.payload.isPrivate);

    case C.onSetSectionScrollTop: {
      const { sectionId, scrollTop } = action.payload;
      return state.setIn(['sectionsScrollTop', sectionId], scrollTop);
    }

    case C.onSetKanbanScrollLeft: {
      const { scrollLeft } = action.payload;
      return state.setIn(['kanbanScrollLeft', action.payload.projectId], scrollLeft);
    }

    case C.onSetIsConversationVisibleSuccess: {
      const { isVisible, conversationId } = action.payload;
      return state.setIn(['isConversationVisible', conversationId], isVisible);
    }

    case C.onBatchConversationsVisibility: {
      const { conversationsVisibility } = action.payload;
      return state.set('isConversationVisible', conversationsVisibility);
    }

    case C.onCreateConversationVisibilityData: {
      const { isVisible, conversationHash } = action.payload.conversationsVisibility;
      return state.setIn(['isConversationVisible', conversationHash], isVisible);
    }

    case C.onBatchProjectHasUnreadMessages: {
      return state.set('projectsHaveUnreadMessages', action.payload.projectsHaveUnreadMessages);
    }

    case C.onSetProjectHasUnreadMessages: {
      return state.setIn(
        ['projectsHaveUnreadMessages', action.payload.projectId],
        action.payload.projectHasUnreadMessages
      );
    }

    case C.onSetProjectsHaveUnreadMessages: {
      let newState = state;

      action.payload.projectIdsWithUnreadMessages.forEach((projectId) => {
        newState = state.setIn(['projectsHaveUnreadMessages', projectId], true);
      });

      return newState;
    }

    case C.onAddFileIdToProjectFileIds: {
      const { projectId, fileId } = action.payload;
      return state.updateIn(['projectFileIds', projectId], (list) => (list ? list.push(fileId) : List([fileId])));
    }

    case C.onBatchProjectFileIds: {
      const { projectId, fileIds } = action.payload;
      return state.updateIn(['projectFileIds', projectId], (list) =>
        list ? list.concat(fileIds).toSet().toList() : fileIds
      );
    }

    case C.onGetFirstProjectSuccess: {
      const { organizationId, projectId } = action.payload;
      return state.setIn(['firstProjectIds', organizationId], projectId);
    }

    default:
      return state;
  }
};

export default reducer;

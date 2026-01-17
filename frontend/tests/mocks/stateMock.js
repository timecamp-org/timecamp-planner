import { fromJS, List, Map } from 'immutable';

import { domain as CurrentUserModelDomain } from 'models/domain/CurrentUserModel/constants';
import { domain as CredentialsModelDomain } from 'models/component/CredentialsModel/constants';

import { domain as OrganizationsModelDomain } from 'models/domain/OrganizationsModel/constants';
import { Organization } from 'models/domain/OrganizationsModel/models';

import { domain as ProjectsModelDomain } from 'models/domain/ProjectsModel/constants';
import { Project } from 'models/domain/ProjectsModel/models';

import { domain as UsersModelDomain } from 'models/domain/UsersModel/constants';
import { User } from 'models/domain/UsersModel/models';

import { domain as ListsModelDomain } from 'models/domain/ListsModel/constants';

import { domain as TasksModelDomain } from 'models/domain/TasksModel/constants';
import { Task } from 'models/domain/TasksModel/models';
import { TaskPeopleRole } from 'models/domain/TasksModel/types';

import { domain as SearchModelDomain } from 'models/component/SearchModel/constants';

import { domain as TagsModelDomain } from 'models/domain/TagsModel/constants';
import { Tag } from 'models/domain/TagsModel/models';

import { domain as ChecklistsModelDomain } from 'models/domain/ChecklistsModel/constants';
import { ChecklistItem } from 'models/domain/ChecklistsModel/models';

import { domain as ActivitiesModelDomain } from 'models/domain/ActivitiesModel/constants';
import { domain as NotificationsModelDomain } from 'models/domain/NotificationsModel/constants';
import { Notification } from 'models/domain/NotificationsModel/models';

import { domain as MessagesModelDomain } from 'models/domain/MessagesModel/constants';
import { Message } from 'models/domain/MessagesModel/models';

import { domain as PaginationModelDomain } from 'models/domain/PaginationModel/constants';

import { domain as FiltersModelDomain } from 'models/component/FiltersModel/constants';
import { Filter } from 'models/component/FiltersModel/models';

import { domain as PopUpAlertsDomain } from 'models/component/PopUpAlertsModel/constants';
import { Alert } from 'models/component/PopUpAlertsModel/models';
import { domain as FilesModelDomain } from 'models/domain/FilesModel/constants';
import { File } from 'models/domain/FilesModel/models';

import { makeObjectReadId } from 'common/utils/generateLocalStorageId';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';

const currentOrganizationId = 'organization::test';

export default fromJS({
  [CurrentUserModelDomain]: {
    onSignInActionResult: null,
    onSignInWithGoogleAccountActionResult: null,
    onSignOutActionResult: null,
    onSignUpActionResult: null,
    onSignUpWithGoogleAccountActionResult: null,

    onSendEmailWithPasswordChangeLinkActionResult: null,

    onPasswordChangeActionResult: null,
    onEmailChangeActionResult: null,
  },

  [CredentialsModelDomain]: {
    email: '',
    password: '',
  },

  [UsersModelDomain]: {
    currentUserId: 'user::test',
    isAuthenticating: true,
    usersData: {
      'user::test': new User({
        id: 'user:test',
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: 'https://avatars1.githubusercontent.com/u/11505680?v=3&s=40',
        email: 'john.doe@gmail.com',
      }),
      'user::1': new User({
        id: 'user::1',
      }),
      'user::2': new User({
        id: 'user::2',
      }),
      'user::3': new User({
        id: 'user::3',
      }),
      'user::4': new User({
        id: 'user::4',
      }),
    },
  },

  [OrganizationsModelDomain]: {
    currentOrganizationId: currentOrganizationId,
    organizationsData: {
      [currentOrganizationId]: new Organization({
        id: currentOrganizationId,
        name: 'Test Organization',
        ownerId: 'user::test',
      }),
    },
    organizationsPeople: {
      [currentOrganizationId]: ['user::test'],
    },
  },

  [ProjectsModelDomain]: {
    projectsData: {
      'project::001': new Project({
        id: 'project::001',
        name: 'test',
        color: '#57BEC7',
        status: 'active',
      }),
      'project::testRoot1': new Project({
        id: 'project::testRoot1',
        name: 'test',
        status: 'active',
      }),
      'project::testChild1': new Project({
        id: 'project::testChild1',
        name: 'test',
        status: 'archived',
      }),
      'project::002': new Project({
        id: 'project::002',
        name: 'test',
        status: 'active',
        isPrivate: true,
        isConversation: true,
      }),
      'project::003': new Project({
        id: 'project::003',
        name: 'test',
        status: 'active',
        isPrivate: true,
        isConversation: false,
      }),
      'project::004': new Project({
        id: 'project::004',
        name: 'test',
        status: 'active',
        isPrivate: true,
        isConversation: false,
      }),
    },
    projectPeople: {
      'project::testRoot1': ['user::test'],
      'project::001': ['user::test'],
      'project::002': ['user::test'],
      'project::003': ['user::2'],
      'project::testChild1': ['user::test'],
      'project::004': ['user::test'],
    },
    projectPeopleRole: {
      'project::testRoot1': {
        'user::test': ProjectPeopleRole.OWNER,
        'user::test2': ProjectPeopleRole.MEMBER,
        'user::test3': ProjectPeopleRole.MEMBER,
      },
      'project::001': {
        'user::test': ProjectPeopleRole.OWNER,
        'user::test2': ProjectPeopleRole.MEMBER,
        'user::test3': ProjectPeopleRole.MEMBER,
      },
    },
    expandedProjects: {},
    projectsTasksFilter: {},
    personalOrder: [],
    projectOrganizationIds: {
      'project::testRoot1': currentOrganizationId,
      'project::testChild1': currentOrganizationId,
      'project::001': currentOrganizationId,
      'project::002': currentOrganizationId,
      'project::003': currentOrganizationId,
      'project::004': currentOrganizationId,
    },
  },

  [CredentialsModelDomain]: {
    email: '',
    password: '',
  },

  [ListsModelDomain]: {
    projectIdsByListIds: {
      'list::001': 'project::001',
    },
    projectIdsByListIdsChangedAt: {},
    listIdsOrderByProject: {
      'project::001': {
        'list::001': 65536,
      },
    },
    listNames: {
      'list::001': 'Test list',
    },
    listIsArchivedStatuses: {
      'list::001': false,
    },
    tasksOrderByListId: {
      'list::001': {
        'task::001': 65536,
        'task::002': 131072,
        'task::003': 196608,
      },
    },
    listIdByTaskId: {
      'task::001': 'list::001',
      'task::002': 'list::001',
      'task::003': 'list::001',
    },
    listIdByTaskIdChangedAt: {},
    listFollowers: {},
  },

  [TasksModelDomain]: {
    tasksData: {
      'task::001': new Task({
        id: 'task::001',
        name: 'Make a meeting',
        order: 65536,
        isArchived: false,
        dueDate: 1583787599999,
        startDate: 1583229600000,
        projectId: 'project::001',
        taskListId: 'list::001',
      }),
      'task::002': new Task({
        id: 'task::002',
        name: 'Test task 2',
        order: 131072,
        isArchived: false,
        dueDate: 1583935199999,
        startDate: 1583344800000,
        projectId: 'project::001',
        taskListId: 'list::001',
      }),
      'task::003': new Task({
        id: 'task::003',
        name: 'Make timeline',
        order: 196608,
        isArchived: false,
        dueDate: 1583492400000,
        startDate: 1583208000000,
        projectId: 'project::001',
        taskListId: 'list::001',
      }),
    },
    taskDescriptions: {},
    taskReactions: {},
    taskPeopleIds: {
      'task::001': ['user::test'],
    },
    taskPeopleRole: {
      'task::001': {
        'user::test': TaskPeopleRole.ASSIGNEE,
      },
    },
    taskTagIds: {},
    taskFollowerIds: {},
    taskLatestVisit: {},
    taskAttachmentsIds: {},
    taskIdByMessageId: {},
    isTaskDescriptionDirty: false,
    projectIdsByTaskIds: {
      'task::001': 'project::001',
      'task::002': 'project::001',
      'task::003': 'project::001',
    },
    taskFileIds: {},
    isWaitingToUpdateProgress: false,
  },

  [SearchModelDomain]: {
    userSearch: {
      results: [],
    },
    taskSearch: {
      results: [],
    },
    projectSearch: {
      results: [],
    },
  },

  [TagsModelDomain]: {
    tagsData: {
      'tag::1': new Tag({ name: 'test' }),
    },
    tagsByObjectId: {
      'object::1': new List(['tag::1']),
    },
    fatalError: undefined,
  },

  [ChecklistsModelDomain]: {
    checklistItemsData: {
      'checklistItem::test': new ChecklistItem({
        id: 'checklistItem::test',
        text: 'test',
        done: true,
      }),
      'checklistItem::emptyText': new ChecklistItem({
        id: 'checklistItem::emptyText',
      }),
      'checklistItem::done': new ChecklistItem({
        id: 'checklistItem::done',
        text: 'done',
        isDone: true,
      }),
      'checklistItem::justCreated': new ChecklistItem({
        id: 'checklistItem::justCreated',
        text: '',
        wasJustCreated: true,
      }),
    },
    checklistsByTaskId: {
      'task::001': List.of('checklistItem::emptyText', 'checklistItem::done', 'checklistItem::justCreated'),
      'task::002': List.of('checklistItem::test'),
    },
    taskIdsByChecklistItemIds: {
      'checklistItem::emptyText': 'task::001',
      'checklistItem::done': 'task::001',
      'checklistItem::justCreated': 'task::001',
      'checklistItem::test': 'task::002',
    },
    fatalError: undefined,
  },

  [ActivitiesModelDomain]: {
    activitiesData: {},
    objectActivities: {},
    fatalError: null,
  },

  [NotificationsModelDomain]: {
    notificationsData: {
      'notification::001': new Notification(
        fromJS({
          id: 'notification::001',
          creationTimestamp: 111111111111,
          type: 'comment',
          activity: {
            actingUserId: 'user::test',
            containerId: 'project::001',
            changes: [
              {
                oldValue: 0,
                newValie: 1,
                property: 'test',
              },
            ],
          },
        })
      ),
    },
    unreadNotificationsLastRead: {
      [currentOrganizationId]: {
        'task::001': 0,
      },
    },
    unreadNotificationsChronology: {
      [currentOrganizationId]: {
        'task::001': ['notification::001'],
        'project::001': ['notification::002'],
      },
    },
    readNotifications: {
      [currentOrganizationId]: {
        'notification::001': 111111111111,
      },
    },
    showArchived: true,
    currentDeviceId: null,
    fatalError: null,
    notificationsSettings: {
      enablePushNotifications: false,
      enableEmailNotifications: false,
      enableMobileNotifications: false,
    },
  },

  [MessagesModelDomain]: {
    objectMessages: {
      'object::1': ['message::1', 'message::2', 'message::3'],
    },
    objectNewMessages: {
      'object::2': 'text',
    },
    messagesData: {
      'message::1': new Message({
        id: 'message::1',
        text: 'message1',
        timestamp: 0,
      }),
      'message::2': new Message({
        id: 'message::2',
        text: 'message2',
        timestamp: 2,
      }),
      'message::3': new Message({
        id: 'message::3',
        text: 'message3',
        timestamp: 4,
      }),
    },
    objectReadData: {
      [makeObjectReadId('object::1', 'user::1')]: 1,
      [makeObjectReadId('object::1', 'user::2')]: 3,
      [makeObjectReadId('object::1', 'user::3')]: 3,
      [makeObjectReadId('object::1', 'user::4')]: 5,
    },
    messageAttachmentsIds: {},
  },
  [PaginationModelDomain]: {
    entitiesPagination: {
      Activity: {},
    },
  },
  [FiltersModelDomain]: {
    filtersData: {
      'filter::test': new Filter({
        filterByField: new Map({
          status: 'active',
        }),
        groupByField: 'dueDate',
      }),
    },
  },
  [PopUpAlertsDomain]: {
    'alert::1': new Alert({ id: 'alert::1' }),
  },
  [FilesModelDomain]: {
    filesData: {
      'file::1': new File({
        id: 'file::1',
        contentType: 'plain/text',
      }),
      'file::2': new File({
        id: 'file::2',
      }),
    },
    objectFiles: {
      'project::1': ['file::1', 'file::2'],
    },
    loader: {
      fileInUploadName: 'testName',
    },
  },
});

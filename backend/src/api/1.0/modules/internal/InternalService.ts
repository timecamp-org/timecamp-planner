import { Id } from '../common/identifier'
import { first, merge, pick, uniq, values } from 'lodash'
import { inject, injectable } from 'inversify'
import { InternalServiceInterface } from './InternalServiceInterface'
import { ListsModule } from '../lists/ListsModule'
import { TasksModule } from '../tasks/TasksModule'
import { TagsModule } from '../tags/TagsModule'
import { ExtensionsModule } from '../extensions/ExtensionsModule'
import { ProjectsModule } from '../projects/ProjectsModule'
import { OrganizationsModule } from '../organizations/OrganizationsModule'
import { FilesModule } from '../files/FilesModule'
import { ChecklistModule } from '../checklist/ChecklistModule'
import { ChecklistItemServiceInterface } from '../checklist/ChecklistItemServiceInterface'
import {
  ConversationViewData,
  FrontendBackgroundResources,
  GetLatestActiveUserConversationsResult,
  GetLatestActiveUserConversationsResultStatus,
  GetOrganizationTagsOverviewDataResult,
  GetOrganizationTagsOverviewDataStatus,
  GetOrganizationViewDataResult,
  GetOrganizationViewDataResultStatus,
  GetTaskDetailsResult,
  GetTaskDetailsStatus,
  GetUserInitialDataResult,
  GetUserInitialDataStatus,
  OnboardingType,
  ProjectBoardData,
  ProjectViewData,
  TaskDetailsData,
} from './types'
import { ChecklistMap, ProjectTasksQueryParams } from '../tasks/types'
import { filterOutEmptyArraysFromMap, invertDict } from '../../../../utils'
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface'
import { TagServiceInterface } from '../tags/TagServiceInterface'
import { CustomFieldServiceInterface } from '../extensions/interfaces/CustomFieldServiceInterface'
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface'
import { OrganizationServiceInterface } from '../organizations/interfaces/OrganizationServiceInterface'
import {
  AppVersionDbRow,
  CustomFieldTargetType,
  OrganizationDbRow,
  UserInTaskDbRow
} from '../db/schema'
import {
  ExtensionNamespace,
  ExtensionsData,
  GetCustomFieldValueStatus,
  GetExtensionsDataStatus
} from '../extensions/types'
import { EntityStatus } from '../common/enum'
import { GetUserProjectsStatus, ProjectTasksResourceContext, ProjectTasksResourceData } from '../projects/types'
import { QueryModifier } from '../../../../services/types'
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface'
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface'
import { ListFollowersProviderInterface } from '../lists/interfaces/ListFollowersProviderInterface'
import { projectsExistsQueryModifier } from '../projects/queryDecorators'
import { ExtensionServiceInterface } from '../extensions/interfaces/ExtensionServiceInterface'
import { MessageServiceInterface } from '../messages/interfaces/MessageServiceInterface'
import { MessagesModule } from '../messages/MessagesModule'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { CommonModule } from '../common/CommonModule'
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface'
import { ProjectFollowersServiceInterface } from '../projects/interfaces/ProjectFollowersServiceInterface'
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface'
import {
  checklistDataQueryModifier,
  conversationSettingsQueryModifier,
  getListsQueryDecorator
} from './queryDecorators'
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface'
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface'
import { organizationExistsQueryModifier } from '../organizations/queryDecorators'
import { NotificationServiceInterface } from '../notifications/interfaces/NotificationServiceInterface'
import { NotificationsModule } from '../notifications/NotificationsModule'
import { getTasksQueryDecorator } from '../tasks/queryDecorators'
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface'
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface'
import Table from '../db/Table'
import { InternalModule } from './InternalModule'
import { AppVersionProviderInterface } from './interfaces/AppVersionProviderInterface'
import { AppPlatform } from '../dict/types'
import { DictProvider } from '../dict/DictProvider'

const projectTasksExtensionNamespaces = [
  ExtensionNamespace.TASK_VOTING,
  ExtensionNamespace.AGILE,
]

const taskExtensionNamespaces = [
  ExtensionNamespace.TASK_RECURRENCE
]

const organizationUserExtensionsNamespaces = [
  ExtensionNamespace.CHAT_WITH_ME
]

@injectable()
export class InternalService implements InternalServiceInterface {

  constructor(
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(TagsModule.TagServiceInterface)
    private tagService: TagServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    private customFieldService: CustomFieldServiceInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    private checklistItemsService: ChecklistItemServiceInterface,
    @inject(FilesModule.FileProviderInterface)
    private fileProvider: FileProviderInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(ListsModule.ListFollowersProviderInterface)
    private listFollowersProvider: ListFollowersProviderInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface)
    private extensionService: ExtensionServiceInterface,
    @inject(MessagesModule.MessageServiceInterface)
    private messagesService: MessageServiceInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ProjectsModule.ProjectFollowersServiceInterface)
    private projectFollowersService: ProjectFollowersServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(NotificationsModule.NotificationServiceInterface)
    private notificationService: NotificationServiceInterface,
    @inject(ProjectsModule.ProjectTasksResource)
    private projectTasksResource: ResourceInterface<ProjectTasksQueryParams, ProjectTasksResourceContext, ProjectTasksResourceData>,
    @inject(InternalModule.AppVersionProviderInterface)
    private appVersionProvider: AppVersionProviderInterface,
    @inject(InternalModule.DictAppPlatform)
    private appPlatformDict: DictProvider<AppPlatform>,
  ) { }

  private async getProjectBoardData(taskIds: Id[], listIds: Id[]): Promise<ProjectBoardData> {
    const projectTasksPeoplePromise = this.taskService.getTasksPeople(taskIds)
    const projectTasksTagsIdsPromise = this.tagService.getTasksTagsIds(taskIds)
    const projectTasksFollowersPromise = this.taskService.getTasksFollowers(taskIds)
    const projectListsFollowersPromise = this.listFollowersProvider.getListsFollowerIdsByListIds(listIds)
    const projectTasksExtensionsDataPromise = this.getTasksExtensionsData(taskIds)
    const projectTasksChecklistsBasicDataPromise = this.checklistItemsService.getTasksChecklistItemsBasicData(taskIds)

    const [
      projectTasksPeople,
      projectTasksTagsIds,
      projectTasksFollowers,
      projectListsFollowers,
      projectTasksExtensionsData,
      projectTasksChecklistsBasicData,
    ] = await Promise.all([
      projectTasksPeoplePromise,
      projectTasksTagsIdsPromise,
      projectTasksFollowersPromise,
      projectListsFollowersPromise,
      projectTasksExtensionsDataPromise,
      projectTasksChecklistsBasicDataPromise,
    ])

    return {
      projectTasksPeople: filterOutEmptyArraysFromMap<UserInTaskDbRow>(projectTasksPeople),
      projectTasksTagsIds: filterOutEmptyArraysFromMap<string>(projectTasksTagsIds),
      projectTasksFollowers: filterOutEmptyArraysFromMap<string>(projectTasksFollowers),
      projectListsFollowers: filterOutEmptyArraysFromMap<string>(projectListsFollowers),
      projectTasksExtensionsData,
      projectTasksChecklistsBasicData,
    }
  }

  private async getTasksExtensionsData(taskIds: Id[], extensionNamespaces = projectTasksExtensionNamespaces): Promise<ExtensionsData> {
    const taskExtensions = await Promise.all(
      extensionNamespaces.map(extensionNamespace => this.extensionService.getExtensionByNamespace(extensionNamespace))
    )
    const taskExtensionIds = taskExtensions.map(extension => extension.id)

    return await this.customFieldService.getExtensionsData(taskExtensionIds, { taskId: taskIds });
  }

  public async getTaskExtensionDependencyData(taskId: Id): Promise<ExtensionsData> {
    let result: ExtensionsData = {}
    const taskExtensions = await Promise.all(
      taskExtensionNamespaces.map(extensionNamespace => this.extensionService.getExtensionByNamespace(extensionNamespace))
    )
    const taskExtensionIds = taskExtensions.map(extension => extension.id)
    const dependencyExtensionsData = await this.customFieldService.getExtensionsData(taskExtensionIds, { targetTaskId: [taskId] });

    const taskIds: Id[] = []

    if (dependencyExtensionsData.status === GetExtensionsDataStatus.OK) {
      result = dependencyExtensionsData.values

      values(result).forEach(relationValues => {
        relationValues.forEach(value => {
          if (value.taskId) {
            taskIds.push(value.taskId)
          }
        })
      })
    }

    if (taskIds.length > 0) {
      const dependencyRelatedExtensionData = await this.customFieldService.getExtensionsData(taskExtensionIds, { taskId: taskIds });

      if (dependencyRelatedExtensionData.status === GetExtensionsDataStatus.OK) {
        result = { ...result, ...dependencyRelatedExtensionData.values }
      }
    }

    return result
  }

  private async getBoardListsAndTasksData(projectId: Id, projectViewDataQueryParams: ProjectTasksQueryParams) {
    const projectListsQueryDecorator = getListsQueryDecorator(projectViewDataQueryParams)
    const getListsPromise = this.listProvider.getProjectLists(projectId, null, projectListsQueryDecorator)

    const project = await this.projectProvider.getProject(projectId)

    const getTasksPromise = this.projectTasksResource.getData(projectViewDataQueryParams, { project })

    const [lists, taskResults] = await Promise.all([getListsPromise, getTasksPromise])

    return {
      tasks: taskResults.tasks,
      lists,
    }
  }

  public async getProjectViewData(projectId: Id, projectViewDataQueryParams: ProjectTasksQueryParams): Promise<ProjectViewData> {
    const { tasks, lists } = await this.getBoardListsAndTasksData(projectId, projectViewDataQueryParams)
    const taskIds = tasks.map(task => task.id)
    const listIds = lists.map(list => list.id)

    const boardDataPromise = this.getProjectBoardData(taskIds, listIds)
    const projectFollowersPromise = this.projectFollowersService.getProjectFollowerIds(projectId);

    const [
      {
        projectTasksPeople,
        projectTasksTagsIds,
        projectTasksFollowers,
        projectListsFollowers,
        projectTasksExtensionsData,
        projectTasksChecklistsBasicData,
      },
      projectFollowersResult,
      getProjectCustomFieldResult,
      getTasksCustomFieldResult,
    ] = await Promise.all([
      boardDataPromise,
      projectFollowersPromise,
      this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.PROJECT, [projectId]),
      this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.TASK, taskIds),
    ])

    return {
      lists,
      listFollowers: projectListsFollowers,
      projectFollowers: projectFollowersResult,
      tasks,
      taskPeople: projectTasksPeople,
      taskFollowers: projectTasksFollowers,
      taskTagIds: projectTasksTagsIds,
      checklistsItemsBasicData: projectTasksChecklistsBasicData,
      projectCustomFields: getProjectCustomFieldResult.status === GetCustomFieldValueStatus.OK
        ? getProjectCustomFieldResult.values
        : {},
      tasksCustomFields: getTasksCustomFieldResult.status === GetCustomFieldValueStatus.OK
        ? getTasksCustomFieldResult.values
        : {},
      extensionsData: projectTasksExtensionsData.status === GetExtensionsDataStatus.OK ? projectTasksExtensionsData.values : {},
    }

  }

  public async getConversationViewData(organizationId: Id, userId: Id, conversationViewDataQueryParams: ProjectTasksQueryParams): Promise<ConversationViewData> {
    const userTasksQueryDecorator = getTasksQueryDecorator({ ...conversationViewDataQueryParams, organizationId })

    let tasks = await this.taskService.getTasksUserIsAssigneeOf(userId, userTasksQueryDecorator)

    tasks = tasks.map(
      task => pick(task, ['id', 'projectId', 'name', 'order', 'taskListId', 'isArchived', 'progress', 'status', 'dueDate', 'startDate']))
    let { taskIds, listIds, projectIds } = tasks.reduce((acc, task) => {
      acc.taskIds = acc.taskIds.concat(task.id)
      acc.listIds = acc.listIds.concat(task.taskListId)
      acc.projectIds = acc.projectIds.concat(task.projectId)
      return acc
    }, {
      taskIds: [],
      listIds: [],
      projectIds: [],
    })

    listIds = uniq(listIds)
    projectIds = uniq(projectIds)

    const boardDataPromise = this.getProjectBoardData(taskIds, listIds)
    const projectsFollowersResultPromise = this.projectFollowersService.getProjectsFollowerIds(projectIds)
    const listsPromise = this.listProvider.getLists(listIds)

    const [
      {
        projectTasksPeople: taskPeople,
        projectTasksTagsIds: taskTagIds,
        projectTasksFollowers: taskFollowers,
        projectListsFollowers: listFollowers,
        projectTasksExtensionsData: extensionsData,
      },
      projectsFollowersResult,
      lists,
      tasksCustomFields,
    ] = await Promise.all([
      boardDataPromise,
      projectsFollowersResultPromise,
      listsPromise,
      this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.TASK, taskIds),
    ])

    return {
      lists,
      listFollowers,
      tasks,
      taskPeople,
      taskFollowers,
      projectsFollowers: projectsFollowersResult,
      taskTagIds,
      tasksCustomFields: tasksCustomFields.status === GetCustomFieldValueStatus.OK ? tasksCustomFields.values : {},
      extensionsData: extensionsData.status === GetExtensionsDataStatus.OK ? extensionsData.values : {},
    }
  }

  public async getLatestActiveUserConversations(organizationId: Id, currentUserId: Id, count?: number): Promise<GetLatestActiveUserConversationsResult> {
    const projectsResult = await this.projectService.getUserProjects(organizationId, currentUserId, projectsExistsQueryModifier)

    if (projectsResult.status === GetUserProjectsStatus.ORGANIZATION_NOT_FOUND) {
      return { status: GetLatestActiveUserConversationsResultStatus.ORGANIZATION_NOT_FOUND }
    } else if (projectsResult.status === GetUserProjectsStatus.USER_NOT_FOUND) {
      return { status: GetLatestActiveUserConversationsResultStatus.USER_NOT_FOUND }
    }

    const projectIds = projectsResult.projects.map(project => project.id)

    const containersWithLatestMessageData = await this.messagesService.getProjectsLatestMessageIdWithDate(projectIds)

    let sortedData = containersWithLatestMessageData.result
      .map(({ containerId, messageId, createdAt }) => ({
        containerId,
        messageId,
        createdAt: this.timeService.getTimeFromDate(createdAt),
      }))
      .sort((a, b) => b.createdAt - a.createdAt)

    if (count) {
      sortedData = sortedData.slice(0, count)
    }

    return {
      status: GetLatestActiveUserConversationsResultStatus.OK,
      latestActiveConversationsData: sortedData,
    }
  }

  public async getOrganizationViewData(organizationId: Id, currentUserId: Id): Promise<GetOrganizationViewDataResult> {

    const projectsResult = await this.projectService.getUserProjects(organizationId, currentUserId, projectsExistsQueryModifier)

    if (projectsResult.status === GetUserProjectsStatus.ORGANIZATION_NOT_FOUND) {
      return { status: GetOrganizationViewDataResultStatus.ORGANIZATION_NOT_FOUND }
    } else if (projectsResult.status === GetUserProjectsStatus.USER_NOT_FOUND) {
      return { status: GetOrganizationViewDataResultStatus.USER_NOT_FOUND }
    }

    const projectIds = projectsResult.projects.map(project => project.id)

    const projectsPeopleQueryModifier: QueryModifier = q => q
      .andWhere('status', EntityStatus.EXISTS)
      .andWhere(`${Table.PROJECT}.id`, 'in', projectIds)

    const projectsPeoplePromise = this.projectPeopleService.getOrganizationProjectsPeople(organizationId, projectsPeopleQueryModifier)
    const projectsCustomFieldsResultPromise = this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.PROJECT, projectIds)
    const projectsHaveUnreadMessagesResultPromise = this.projectService.getUserProjectsUnreadMessages(currentUserId)

    const conversationsSettingsPromise = this.conversationService.getUserConversationsSettings(
      currentUserId,
      organizationId,
      conversationSettingsQueryModifier,
    )


    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, organizationId)

    let organizationExtensions = await Promise.all(
      organizationUserExtensionsNamespaces.map(extensionNamespace => this.extensionService.getExtensionByNamespace(extensionNamespace))
    )
    organizationExtensions = organizationExtensions.filter(Boolean)

    const organizationExtensionIds = organizationExtensions.map(extension => extension.id)
    const extensionsDataPromise = this.customFieldService.getExtensionsData(organizationExtensionIds, { userInOrganizationId: [userInOrganization.id] });

    const [
      projectsPeopleResult,
      projectsCustomFieldsResult,
      projectsHaveUnreadMessagesResult,
      conversationsSettings,
      extensionsData,
    ] = await Promise.all([
      projectsPeoplePromise,
      projectsCustomFieldsResultPromise,
      projectsHaveUnreadMessagesResultPromise,
      conversationsSettingsPromise,
      extensionsDataPromise
    ])

    return {
      status: GetOrganizationViewDataResultStatus.OK,
      organizationViewData: {
        projects: projectsResult.projects,
        projectsPeople: projectsPeopleResult.organizationProjectsPeople,
        projectsCustomFields: projectsCustomFieldsResult.values,
        projectsHaveUnreadMessages: projectsHaveUnreadMessagesResult.projectsHaveUnreadMessages,
        organizationIdByProjectId: projectsHaveUnreadMessagesResult.organizationIdByProjectId,
        conversationsSettings,
        subscriptionCancellationRequestStatus: null,
        extensionsData: extensionsData.status === GetExtensionsDataStatus.OK ? extensionsData.values : {},
      }
    }
  }

  public async getTaskDetailsViewData(taskId: Id): Promise<GetTaskDetailsResult> {
    const taskAttachmentIds = await this.taskService.getTaskAttachmentIds(taskId);

    const [
      task,
      checklistItems,
      checklistItemsAssignees,
      attachments,
      taskCustomFields,
      extensionsData,
      dependencyExtensionData,
      followers,
      people,
      tags
    ] = await Promise.all([
      this.taskService.getTaskById(taskId),
      this.checklistItemsService.getChecklistItemsWhereTaskId(taskId, checklistDataQueryModifier),
      this.checklistItemsService.getTaskChecklistItemsAssignees(taskId),
      this.fileProvider.getFilesByIds(taskAttachmentIds),
      this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.TASK, [taskId]),
      this.getTasksExtensionsData([taskId], taskExtensionNamespaces),
      this.getTaskExtensionDependencyData(taskId),
      this.taskService.getTaskFollowerIds(taskId),
      this.taskService.getTaskPeople(taskId),
      this.tagService.getTasksTags([taskId]), // to remove ~ 24.07.2021
      
    ])

    const tasksTagsIds = await this.tagService.getTasksTagsIds([taskId])

    if (!task) {
      return { status: GetTaskDetailsStatus.TASK_NOT_FOUND }
    }

    const checklist: ChecklistMap = {}
    checklistItems.forEach(checklistItem => {
      checklist[checklistItem.id] = checklistItem;
    })

    const parentList = await this.listProvider.getList(task.taskListId)

    const mergedExtensionsData = merge(
      extensionsData.status === GetExtensionsDataStatus.OK ? extensionsData.values : {},
      dependencyExtensionData
    )

    const data: TaskDetailsData = {
      task,
      attachments,
      followers,
      people,
      checklist,
      checklistItemsAssignees,
      tags,
      customFields: taskCustomFields.status === GetCustomFieldValueStatus.OK ? taskCustomFields.values : {},
      parentList,
      extensionsData: mergedExtensionsData,
      tasksTagsIds
    }
    return { status: GetTaskDetailsStatus.OK, data }
  }

  async getOrganizationTagsOverviewData(organizationId: Id): Promise<GetOrganizationTagsOverviewDataResult> {
    const { organization } = await this.organizationService.getOrganization(organizationId)

    if (!organization) {
      return {
        status: GetOrganizationTagsOverviewDataStatus.ORGANIZATION_NOT_FOUND
      }
    }

    const tagsDataPromise = this.tagService.getOrganizationTags(organizationId)
    const taskIdsByTagIdsPromise = this.tagService.getTagsTaskIds(organizationId)
    // TODO: handle projects tags when needed

    const [
      { organizationTags },
      taskIdsByTagIds,
    ] = await Promise.all([
      tagsDataPromise,
      taskIdsByTagIdsPromise,
    ])

    const tasksTagIds = invertDict(taskIdsByTagIds);

    return {
      status: GetOrganizationTagsOverviewDataStatus.OK,
      tagsData: organizationTags,
      tasksTagIds,
    }
  }

  async getUserOnboardingType(userId: Id, organizationId: Id): Promise<OnboardingType> {
    const firstVisibleProjectId = await this.projectProvider.getFirstUserVisibleProjectId(userId, organizationId)

    if (!firstVisibleProjectId) {
      return OnboardingType.NO_SPACES
    }

    const firstVisibleListId = await this.listProvider.getFirstVisibleTaskListId(firstVisibleProjectId)

    if (!firstVisibleListId) {
      return OnboardingType.SPACE_WITHOUT_CARDS
    }

    const firstVisibleTaskId = await this.taskProvider.getFirstVisibleTaskIdInList(firstVisibleListId);
    if (!firstVisibleTaskId) {
      return OnboardingType.SPACE_WITHOUT_CARDS
    }

    return OnboardingType.SPACE_WITH_CARDS
  }

  async getUserInitialData(userId: Id, localOrganizationId: Id, projectId?: Id): Promise<GetUserInitialDataResult> {
    const userOrganizations
      = await this.organizationService.getOrganizationsForUser(userId, undefined, organizationExistsQueryModifier)
    const organizationIds = userOrganizations.map(organization => organization.id)

    let currentOrganization: OrganizationDbRow = null
    if (organizationIds.includes(localOrganizationId)) {
      currentOrganization = userOrganizations.find(organization => organization.id === localOrganizationId)
    } else {
      currentOrganization = first(userOrganizations)
    }

    /* It's ok that user has no organization.
    * This is not an exception. Client app should point user to create new organization.
    */
    if (!currentOrganization) {
      return {
        status: GetUserInitialDataStatus.OK,
      }
    }

    const currentUserInOrganization = await this.userInOrganizationProvider.getUserInOrganization(
      userId,
      currentOrganization.id
    )

    let firstProjectId: Id = projectId

    if (!firstProjectId) {
      firstProjectId = await this.projectService.getInitialProjectId(userId, currentOrganization.id)
    }

    if (!firstProjectId) {
      return {
        status: GetUserInitialDataStatus.OK,
        currentOrganization,
        currentUserInOrganization,
        firstProject: null,
        firstProjectPeople: [],
      }
    }

    const firstProject = await this.projectProvider.getProject(firstProjectId)
    const firstProjectPeople = firstProject ? await this.projectPeopleService.getProjectPeople(firstProjectId) : []

    return {
      status: GetUserInitialDataStatus.OK,
      currentOrganization,
      currentUserInOrganization,
      firstProject,
      firstProjectPeople,
    }
  }

  async getFrontendBackgroundResourcesAction(organizationId: Id, userId: Id): Promise<FrontendBackgroundResources> {
    const [
      unreadNotifications,
      userProjectsResult,
      projectsPeople,
      projectIdsWithUnreadMessages,
    ] = await Promise.all([
      this.notificationService.getAllUnreadNotifications(userId),
      this.projectService.getUserProjects(organizationId, userId),
      this.projectPeopleService.getOrganizationProjectsPeopleForUser(organizationId, userId),
      this.projectService.getProjectIdsInOrganizationWithUnreadMessages(organizationId, userId),
    ])

    return {
      unreadNotifications,
      projects: userProjectsResult.projects,
      projectsPeople,
      projectIdsWithUnreadMessages,
    }
  }

  async getCurrentAppVersion(appPlatform: AppPlatform): Promise<AppVersionDbRow> {
    const { id } = await this.appPlatformDict.getItemByValue(AppPlatform.WEB)
    return await this.appVersionProvider.getCurrentAppVersion(id)
  }

}

import { Id } from "../common/identifier";
import {
  GetOrganizationTagsOverviewDataResult,
  GetOrganizationViewDataResult,
  GetTaskDetailsResult,
  ProjectViewData,
  ConversationViewData,
  GetLatestActiveUserConversationsResult,
  OnboardingType,
  GetUserInitialDataResult,
  FrontendBackgroundResources,
} from './types'
import { ProjectTasksQueryParams } from "../tasks/types";
import { AppVersionDbRow } from '../db/schema'
import { AppPlatform } from '../dict/types'

export interface InternalServiceInterface {
  getProjectViewData(projectId: Id, projectViewDataQueryParams: ProjectTasksQueryParams): Promise<ProjectViewData>;

  getConversationViewData(organizationId: Id, userId: Id, conversationViewDataQueryParams: ProjectTasksQueryParams): Promise<ConversationViewData>

  getLatestActiveUserConversations(organizationId: Id, currentUserId: Id, count?: number): Promise<GetLatestActiveUserConversationsResult>

  getOrganizationViewData(organizationId: Id, currentUserId: Id): Promise<GetOrganizationViewDataResult>

  getTaskDetailsViewData(taskId: Id): Promise<GetTaskDetailsResult>

  getOrganizationTagsOverviewData(organizationId: Id): Promise<GetOrganizationTagsOverviewDataResult>

  getUserOnboardingType(userId: Id, organizationId: Id): PromiseLike<OnboardingType>;

  getUserInitialData(userId: Id, localOrganizationId: Id, projectId?: Id): PromiseLike<GetUserInitialDataResult>;

  getFrontendBackgroundResourcesAction(organizationId: Id, userId: Id): Promise<FrontendBackgroundResources>

  getCurrentAppVersion(appPlatform: AppPlatform): PromiseLike<AppVersionDbRow>
}

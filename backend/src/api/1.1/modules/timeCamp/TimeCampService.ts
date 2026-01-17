import { inject, injectable } from 'inversify';
import { TimeCampModule } from './TimeCampModule';
import { TimeCampApiInterface } from './interfaces/TimeCampApiInterface';
import {
  GetTimeEntryOptions,
  TimeCampServiceInterface,
  TimerActionInterface,
} from './interfaces/TimeCampServiceInterface';
import {
  CreateTimeEntryResult,
  CreateTimeEntryStatus,
  GetTimeEntriesResult,
  GetTimeEntriesStatus,
  HasTokenResult,
  HasTokenStatus,
  TimerActionResult,
  TimerActionStatus,
} from './types';

import { QueryModifier } from '../../../../services/types';
import { CustomFieldTargetType } from '../db/schema';
import { ExtensionsModule } from '../extensions/ExtensionsModule';
import { CustomFieldProviderInterface } from '../extensions/interfaces/CustomFieldProviderInterface';
import { ExtensionProviderInterface } from '../extensions/interfaces/ExtensionProviderInterface';
import { ListsModule } from '../lists/ListsModule';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { TasksModule } from '../tasks/TasksModule';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
@injectable()
export class TimeCampService implements TimeCampServiceInterface {
  constructor(
    @inject(TimeCampModule.TimeCampApiInterface)
    private timeCampApi: TimeCampApiInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectsProvider: ProjectProviderInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ExtensionsModule.CustomFieldProviderInterface)
    private customFieldProviderInterface: CustomFieldProviderInterface,
    @inject(ExtensionsModule.ExtensionProviderInterface)
    private extensionProviderInterface: ExtensionProviderInterface
  ) {}
  async getTokenFromTaskId({ userId, taskId }) {
    const { projectId } = await this.taskProvider.getTaskById(taskId);
    const { organizationId } = await this.projectsProvider.getProject(projectId);

    return await this.getTokenFromOrganizationId({ userId, organizationId });
  }

  async getTokenFromOrganizationId({ userId, organizationId }) {
    const { id: userInOrganizationId } = await this.userInOrganizationProvider.getUserInOrganization(
      userId,
      organizationId
    );

    const { id: extensionId } = await this.extensionProviderInterface.getExtensionByNamespace('timecamp');

    const { id: customFieldId } = await this.customFieldProviderInterface.getCustomFieldByName(
      extensionId,
      CustomFieldTargetType.USER_IN_ORGANIZATION,
      'access_token'
    );
    const timeCampTokenExtensionQueryModifier: QueryModifier = (q) => {
      return q.where({ targetId: userInOrganizationId });
    };
    const token = await this.customFieldProviderInterface.getCustomFieldValues(
      customFieldId,
      CustomFieldTargetType.USER_IN_ORGANIZATION,
      timeCampTokenExtensionQueryModifier
    );

    return token;
  }

  async getNoteFromTaskId({ taskId }) {
    const { projectId, name: taskName, taskListId } = await this.taskProvider.getTaskById(taskId);
    const { name: projectName } = await this.projectsProvider.getProject(projectId);
    const { name: listName } = await this.listProvider.getList(taskListId);

    const note = `Project: "${projectName}
    "List: "${listName}
    "Task: "${taskName}"`;

    return note;
  }

  async hasToken({ userId, organizationId }): Promise<HasTokenResult> {
    const token = await this.getTokenFromOrganizationId({ userId, organizationId });
    if (!token.length) {
      return {
        status: HasTokenStatus.TOKEN_NOT_FOUND,
      };
    }

    return {
      status: HasTokenStatus.OK,
    };
  }

  async timerAction({ action, taskId, userId }: TimerActionInterface): Promise<TimerActionResult> {
    const token = await this.getTokenFromTaskId({ userId, taskId });
    if (!token.length) {
      return {
        status: TimerActionStatus.TOKEN_NOT_FOUND,
      };
    }
    const note = await this.getNoteFromTaskId({ taskId });

    const options = {
      note,
      token: token[0].value,
      action,
      external_task_id: `task_${taskId}`,
    };

    let timerActionResult;

    switch (action) {
      case 'start':
        timerActionResult = await this.timeCampApi.startTimer(options);
        break;
      case 'stop':
        timerActionResult = await this.timeCampApi.stopTimer(options);
        break;
      case 'status':
        timerActionResult = await this.timeCampApi.getTimerStatus(options);
        break;
    }

    return {
      status: TimerActionStatus.OK,
      timerActionResult,
    };
  }

  async createTimeEntry({ userId, taskId, duration, start, end, date }): Promise<CreateTimeEntryResult> {
    const token = await this.getTokenFromTaskId({ taskId, userId });
    if (!token.length) {
      return {
        status: CreateTimeEntryStatus.TOKEN_NOT_FOUND,
      };
    }
    const note = await this.getNoteFromTaskId({ taskId });

    const timecampTask = await this.timeCampApi.getTaskIdFromExternalTaskId({
      token: token[0].value,
      taskId: `task_${taskId}`,
    });
    if (!timecampTask) {
      return {
        status: CreateTimeEntryStatus.TASK_NOT_FOUND,
      };
    }

    const { entry_id } = await this.timeCampApi.createTimeEntry({
      token: token[0].value,
      duration,
      start,
      end,
      date,
      task_id: timecampTask.task_id,
      note,
    });

    return {
      status: CreateTimeEntryStatus.OK,
      timeEntryId: entry_id,
    };
  }
  async getTimeEntries({ userId, taskId }: GetTimeEntryOptions): Promise<GetTimeEntriesResult> {
    const token = await this.getTokenFromTaskId({ taskId, userId });
    if (!token.length) {
      return {
        status: GetTimeEntriesStatus.TOKEN_NOT_FOUND,
      };
    }

    const timecampTask = await this.timeCampApi.getTaskIdFromExternalTaskId({
      token: token[0].value,
      taskId: `task_${taskId}`,
    });
    if (!timecampTask) {
      return {
        status: GetTimeEntriesStatus.TASK_NOT_FOUND,
      };
    }

    const timeEntries = await this.timeCampApi.getTimeEntries({
      token: token[0].value,
      taskId: timecampTask.task_id,
    });

    return {
      status: GetTimeEntriesStatus.OK,
      timeEntries,
    };
  }
}

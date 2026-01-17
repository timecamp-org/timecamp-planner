import { Request, Response } from 'express';

import {
  AddTaskFollowerStatus,
  AddTaskPeopleStatus,
  AttachFileToTaskStatus,
  AttachTagToTaskStatus,
  CopyTaskStatus,
  CreateTaskStatus,
  CreateTaskTimeEstimatesStatus,
  DeleteTaskPeopleStatus,
  DeleteTaskTimeEstimatesStatus,
  DetachFileFromTaskStatus,
  DetachTagFromTaskStatus,
  GetTaskChecklistStatus,
  GetTaskTimeEstimatesStatus,
  RemoveTaskFollowerStatus,
  SetUserLatestTaskVisitDateResultStatus,
  UpdateTaskPeopleStatus,
  UpdateTaskStatus,
  UpdateTaskTimeEstimatesStatus,
} from '../modules/tasks/types';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { HttpStatus } from '../../../infrastructure/enum';
import { injectable, inject } from 'inversify';
import { TasksModule } from '../modules/tasks/TasksModule';
import { TaskServiceInterface } from '../modules/tasks/interfaces/TaskServiceInterface';
import { ChecklistModule } from '../modules/checklist/ChecklistModule';
import { ChecklistItemServiceInterface } from '../modules/checklist/ChecklistItemServiceInterface';
import { CommonModule } from '../modules/common/CommonModule';
import { IdGeneratorInterface, Id } from '../modules/common/identifier';

@injectable()
export class TaskController {
  private taskService: TaskServiceInterface;
  private idGenerator: IdGeneratorInterface<Id>;

  constructor(
    @inject(TasksModule.TaskServiceInterface)
    taskService: TaskServiceInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    checklistItemService: ChecklistItemServiceInterface,
    @inject(CommonModule.IdGeneratorInterface)
    idGenerator: IdGeneratorInterface<Id>
  ) {
    this.taskService = taskService;
    this.idGenerator = idGenerator;
  }

  async createTaskAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const taskId = req.params.taskId || this.idGenerator.generateId();
      const result = await this.taskService.createTask(taskId, userId, req.body);

      switch (result.status) {
        case CreateTaskStatus.OK:
          return res.send(result.task);
        case CreateTaskStatus.TASK_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.TASK_ALREADY_EXISTS]);
        case CreateTaskStatus.TASK_WITH_ORDER_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.TASK_WITH_ORDER_ALREADY_EXISTS]);
        case CreateTaskStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case CreateTaskStatus.LIST_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND]);
        case CreateTaskStatus.DUE_DATE_EARLIER_THAN_START_DATE:
          return res.send(ErrorDefinitions[Type.TASK_DUE_DATE_EARLIER_THAN_START_DATE]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateTaskAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const result = await this.taskService.updateTask(req.params.taskId, req.body, userId);

      switch (result.status) {
        case UpdateTaskStatus.OK:
          return res.status(HttpStatus.OK).send();
        case UpdateTaskStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        case UpdateTaskStatus.TASK_WITH_ORDER_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.TASK_WITH_ORDER_ALREADY_EXISTS]);
        case UpdateTaskStatus.DUE_DATE_EARLIER_THAN_START_DATE:
          return res.send(ErrorDefinitions[Type.TASK_DUE_DATE_EARLIER_THAN_START_DATE]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addTaskPeopleAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const result = await this.taskService.addTaskPeople(req.params.taskId, req.params.userId, req.body.role, userId);

      switch (result.status) {
        case AddTaskPeopleStatus.OK:
          return res.send();
        case AddTaskPeopleStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case AddTaskPeopleStatus.USER_ALREADY_IN_TASK:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_TASK]);
        case AddTaskPeopleStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateTaskPeopleRoleAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.updateTaskPeopleRole(req.params.taskId, req.params.userId, req.body.role);

      switch (result.status) {
        case UpdateTaskPeopleStatus.OK:
          return res.status(HttpStatus.OK).send();
        case UpdateTaskPeopleStatus.TASK_PEOPLE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_PEOPLE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteTaskPeopleRoleAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const result = await this.taskService.deleteTaskPeopleRole(req.params.taskId, req.params.userId, userId);

      switch (result.status) {
        case DeleteTaskPeopleStatus.OK:
          return res.status(HttpStatus.OK).send();
        case DeleteTaskPeopleStatus.TASK_PEOPLE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_PEOPLE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async attachTagToTaskAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.attachTagToTask(req.params.taskId, req.params.tagId);

      switch (result.status) {
        case AttachTagToTaskStatus.OK:
          return res.send();
        case AttachTagToTaskStatus.TAG_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TAG_NOT_FOUND]);
        case AttachTagToTaskStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        case AttachTagToTaskStatus.TASK_ALREADY_HAS_TAG:
          return res.send(ErrorDefinitions[Type.TASK_ALREADY_HAS_TAG]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async detachTagFromTaskAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.detachTagFromTask(req.params.taskId, req.params.tagId);

      switch (result.status) {
        case DetachTagFromTaskStatus.OK:
          return res.status(HttpStatus.OK).send();
        case DetachTagFromTaskStatus.TASK_TAG_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_TAG_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async attachFileToTaskAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.attachFileToTask(
        req.params.taskId,
        req.params.fileId,
        req.heyspace.authResult.userId
      );

      switch (result.status) {
        case AttachFileToTaskStatus.OK:
          return res.status(HttpStatus.OK).send();
        case AttachFileToTaskStatus.FILE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.FILE_NOT_FOUND]);
        case AttachFileToTaskStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async detachFileFromTaskAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.detachFileFromTask(req.params.taskId, req.params.fileId);

      switch (result.status) {
        case DetachFileFromTaskStatus.OK:
          return res.status(HttpStatus.OK).send();
        case DetachFileFromTaskStatus.TASK_ATTACHMENT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_ATTACHMENT_NOT_FOUND]);
        case DetachFileFromTaskStatus.FILE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.FILE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTaskChecklistAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.getTaskChecklist(req.params.taskId);

      switch (result.status) {
        case GetTaskChecklistStatus.OK:
          return res.status(HttpStatus.OK).send(result.data);
        case GetTaskChecklistStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async copyTaskAction(req: Request, res: Response) {
    try {
      const { sourceTaskId } = req.params;
      const { userId } = req.heyspace.authResult;
      const { name, order, newTaskId, options } = req.body;
      const result = await this.taskService.copyTask(sourceTaskId, userId, name, order, newTaskId, null, options);

      switch (result.status) {
        case CopyTaskStatus.OK:
          return res.send({ id: result.newTaskId });
        case CopyTaskStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addTaskFollowerAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.addTaskFollower(req.params.taskId, req.params.userId);

      switch (result.status) {
        case AddTaskFollowerStatus.OK:
          return res.send();
        case AddTaskFollowerStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case AddTaskFollowerStatus.USER_ALREADY_FOLLOWING_TASK:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_FOLLOWING_TASK]);
        case AddTaskFollowerStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async removeTaskFollowerAction(req: Request, res: Response) {
    try {
      const result = await this.taskService.removeTaskFollower(req.params.taskId, req.params.userId);

      switch (result.status) {
        case RemoveTaskFollowerStatus.OK:
          return res.status(HttpStatus.OK).send();
        case RemoveTaskFollowerStatus.TASK_FOLLOWER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_FOLLOWER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async setUserLatestTaskVisitDateAction(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.heyspace.authResult.userId;
      const { taskId } = req.params;
      const { visitedAt } = req.body;

      const result = await this.taskService.setUserLatestTaskVisitDate(userId, taskId, visitedAt);

      switch (result.status) {
        case SetUserLatestTaskVisitDateResultStatus.OK:
          return res.status(HttpStatus.OK).send();
        case SetUserLatestTaskVisitDateResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case SetUserLatestTaskVisitDateResultStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTaskTimeEstimatesAction(req: Request, res: Response) {
    try {
      const { taskId } = req.params;

      const result = await this.taskService.getTaskTimeEstimates(taskId);

      switch (result.status) {
        case GetTaskTimeEstimatesStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case GetTaskTimeEstimatesStatus.TASK_TIME_ESTIMATE_NOT_FOUND:
          return res.send();
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createTaskTimeEstimatesAction(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { userId } = req.heyspace.authResult;
      const payload = { ...req.body, taskId };

      const result = await this.taskService.createTaskTimeEstimates(payload, userId);

      switch (result.status) {
        case CreateTaskTimeEstimatesStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case CreateTaskTimeEstimatesStatus.TASK_TIME_ESTIMATE_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.RESOURCE_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateTaskTimeEstimatesAction(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const payload = { ...req.body, taskId };
      const { userId } = req.heyspace.authResult;

      const result = await this.taskService.updateTaskTimeEstimates(payload, userId);

      switch (result.status) {
        case UpdateTaskTimeEstimatesStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteTaskTimeEstimatesAction(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { userId } = req.heyspace.authResult;

      const result = await this.taskService.deleteTaskTimeEstimates(taskId, userId);

      switch (result.status) {
        case DeleteTaskTimeEstimatesStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

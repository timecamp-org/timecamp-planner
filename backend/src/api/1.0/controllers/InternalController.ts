import { Request, Response } from 'express';

import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { MessageContainerType } from '../modules/db/schema';
import { GetContainerMessagesStatus } from '../modules/messages/types';
import {
  GetLatestActiveUserConversationsResultStatus,
  GetOrganizationTagsOverviewDataResult,
  GetOrganizationTagsOverviewDataStatus,
  GetOrganizationViewDataResult,
  GetOrganizationViewDataResultStatus,
  GetTaskDetailsStatus,
} from '../modules/internal/types';
import { HttpStatus } from '../../../infrastructure/enum';
import { GetMessageContainerImageFilesResultStatus } from '../modules/files/types';
import { inject, injectable } from 'inversify';
import { InternalServiceInterface } from '../modules/internal/InternalServiceInterface';
import { MessageServiceInterface } from '../modules/messages/interfaces/MessageServiceInterface';
import { FileServiceInterface } from '../modules/files/interfaces/FileServiceInterface';
import { InternalModule } from '../modules/internal/InternalModule';
import { MessagesModule } from '../modules/messages/MessagesModule';
import { FilesModule } from '../modules/files/FilesModule';
import { ProcessManagerModule } from '../modules/processManager/ProcessManagerModule';
import { ProcessName } from '../modules/processManager/types';
import { ProcessCommunicationInterface } from '../modules/processManager/interfaces/ProcessCommunicationInterface';
import { AppPlatform } from '../modules/dict/types';
import { ProjectTasksQueryParams } from '../modules/tasks/types';

@injectable()
export class InternalController {
  constructor(
    @inject(InternalModule.InternalServiceInterface)
    private internalService: InternalServiceInterface,

    @inject(MessagesModule.MessageServiceInterface)
    private messageService: MessageServiceInterface,

    @inject(FilesModule.FileServiceInterface)
    private fileService: FileServiceInterface,

    @inject(ProcessManagerModule.ProcessCommunicationInterface)
    private processCommunication: ProcessCommunicationInterface
  ) {}

  async getProjectMessageBoardAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;

      const result = await this.messageService.getContainerMessagesFilesAndReactions(
        MessageContainerType.PROJECT,
        req.params.projectId,
        req.query.page,
        parseInt(req.query.limit as string),
        userId,
        Boolean(req.query.fetchAllUnreadMessages)
      );

      switch (result.status) {
        case GetContainerMessagesStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case GetContainerMessagesStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case GetContainerMessagesStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTaskMessageBoardAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const result = await this.messageService.getContainerMessagesActivitiesFilesAndReactions(
        MessageContainerType.TASK,
        req.params.taskId,
        req.query.page,
        parseInt(req.query.limit as string),
        userId
      );

      switch (result.status) {
        case GetContainerMessagesStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case GetContainerMessagesStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case GetContainerMessagesStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectFiles(req: Request, res: Response) {
    try {
      const result = await this.fileService.getMessageContainerImageFiles(
        MessageContainerType.PROJECT,
        req.params.projectId,
        req.query.page as string,
        parseInt(req.query.limit as string)
      );

      switch (result.status) {
        case GetMessageContainerImageFilesResultStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case GetMessageContainerImageFilesResultStatus.CONTAINER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTaskFiles(req: Request, res: Response) {
    try {
      const result = await this.fileService.getMessageContainerImageFiles(
        MessageContainerType.TASK,
        req.params.taskId,
        req.query.page as string,
        parseInt(req.query.limit as string)
      );

      switch (result.status) {
        case GetMessageContainerImageFilesResultStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case GetMessageContainerImageFilesResultStatus.CONTAINER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectViewData(req: Request, res: Response) {
    try {
      const data = await this.internalService.getProjectViewData(
        req.params.projectId,
        req.query as unknown as ProjectTasksQueryParams
      );
      return res.send(data);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getConversationViewData(req: Request, res: Response) {
    try {
      const { organizationId, userId } = req.params;
      const data = await this.internalService.getConversationViewData(
        organizationId,
        userId,
        req.query as unknown as ProjectTasksQueryParams
      );
      return res.send(data);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getLatestActiveUserConversations(req: Request, res: Response) {
    try {
      const result = await this.internalService.getLatestActiveUserConversations(
        req.params.organizationId,
        req.heyspace.authResult.userId,
        parseInt(req.query.count as string)
      );

      switch (result.status) {
        case GetLatestActiveUserConversationsResultStatus.OK:
          return res.send(result.latestActiveConversationsData);
        case GetLatestActiveUserConversationsResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case GetLatestActiveUserConversationsResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getOrganizationViewData(req: Request, res: Response) {
    try {
      const result: GetOrganizationViewDataResult = await this.internalService.getOrganizationViewData(
        req.params.organizationId,
        req.heyspace.authResult.userId
      );

      switch (result.status) {
        case GetOrganizationViewDataResultStatus.OK:
          return res.send(result.organizationViewData);
        case GetOrganizationViewDataResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case GetOrganizationViewDataResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getLinkMetadataAction(req: Request, res: Response) {
    try {
      const { targetUrl } = req.query;
      const result = await this.processCommunication.sendRequestToProcess(ProcessName.HEYSPACE_LINK_SCRAPER, {
        targetUrl,
        acceptsLanguages: req.headers['accept-language'],
      });
      if (result.metadata) {
        res.send(result.metadata);
      } else {
        res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getOrganizationTagsOverviewData(req: Request, res: Response) {
    try {
      const result: GetOrganizationTagsOverviewDataResult = await this.internalService.getOrganizationTagsOverviewData(
        req.params.organizationId
      );

      switch (result.status) {
        case GetOrganizationTagsOverviewDataStatus.OK: {
          return res.send({
            tagsData: result.tagsData,
            tasksTagIds: result.tasksTagIds,
          });
        }
        case GetOrganizationTagsOverviewDataStatus.ORGANIZATION_NOT_FOUND: {
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        }
        default: {
          return res.send(ErrorDefinitions[Type.INTERNAL]);
        }
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTaskDetailsAction(req: Request, res: Response) {
    try {
      const result = await this.internalService.getTaskDetailsViewData(req.params.taskId);

      switch (result.status) {
        case GetTaskDetailsStatus.OK:
          return res.status(HttpStatus.OK).send(result.data);
        case GetTaskDetailsStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getFrontendBackgroundResourcesAction(req: Request, res: Response) {
    try {
      const result = await this.internalService.getFrontendBackgroundResourcesAction(
        req.params.organizationId,
        req.heyspace.authResult.userId
      );

      return res.send(result);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getClientIp(req: Request, res: Response) {
    try {
      return res.send(req.clientIp);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getAppVersion(req: Request, res: Response) {
    try {
      const appPlatform = req.params.appPlatform as AppPlatform;
      const result = await this.internalService.getCurrentAppVersion(appPlatform);

      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

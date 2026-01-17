import { Request, Response } from 'express';

import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { HttpStatus } from '../../../infrastructure/enum';

import {
  AddProjectFollowerStatus,
  AddProjectPersonsStatus,
  AddProjectPersonStatus,
  CreateProjectStatus,
  DeleteProjectPeopleRoleStatus,
  RemoveProjectFollowerStatus,
  UpdateConversationSettingsResultStatus,
  UpdateProjectPeopleRoleStatus,
  UpdateProjectStatus,
  GetUserArchivedProjectsViewDataStatus,
  SetUserProjectSettingsStatus,
  CopySpaceStatus,
  GetProjectTasksWithMetadataStatus,
  GetProjectWithMetadataStatus,
  GetProjectPersonsStatus,
  SetProjectLatestVisitStatus,
  GetProjectAttachmentsStatus,
  CreateProjectFileStatus,
} from '../modules/projects/types';
import { GetProjectListsAndListsFollowersStatus } from '../modules/lists/types';
import { ProjectTasksQueryParams } from '../modules/tasks/types';
import { inject, injectable } from 'inversify';
import { ProjectService } from '../modules/projects/ProjectService';
import { ListServiceInterface } from '../modules/lists/interfaces/ListServiceInterface';
import { ProjectsModule } from '../modules/projects/ProjectsModule';
import { ListsModule } from '../modules/lists/ListsModule';
import { CommonModule } from '../modules/common/CommonModule';
import { IdGeneratorInterface, Id } from '../modules/common/identifier';
import { ProjectSettingsProviderInterface } from '../modules/projects/interfaces/ProjectSettingsProviderInterface';
import { ProjectFollowersServiceInterface } from '../modules/projects/interfaces/ProjectFollowersServiceInterface';
import { ProjectPeopleServiceInterface } from '../modules/projects/interfaces/ProjectPeopleServiceInterface';
import { ProjectTasksServiceInterface } from '../modules/projects/interfaces/ProjectTasksServiceInterface';
import { ConversationServiceInterface } from '../modules/projects/interfaces/ConversationServiceInterface';

@injectable()
export class ProjectController {
  constructor(
    @inject(ProjectsModule.ProjectServiceInterface)
    protected projectService: ProjectService,

    @inject(ListsModule.ListServiceInterface)
    protected listService: ListServiceInterface,

    @inject(CommonModule.IdGeneratorInterface)
    protected idGenerator: IdGeneratorInterface<Id>,

    @inject(ProjectsModule.ProjectSettingsProviderInterface)
    protected projectSettingsProvider: ProjectSettingsProviderInterface,

    @inject(ProjectsModule.ProjectFollowersServiceInterface)
    protected projectFollowersService: ProjectFollowersServiceInterface,

    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    protected projectPeopleService: ProjectPeopleServiceInterface,

    @inject(ProjectsModule.ProjectTasksServiceInterface)
    protected projectTasksService: ProjectTasksServiceInterface,

    @inject(ProjectsModule.ConversationServiceInterface)
    protected conversationService: ConversationServiceInterface
  ) {}

  async createProjectAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const projectId = req.params.projectId || this.idGenerator.generateId();
      const { projectPeople, ...projectJson } = req.body;
      const createProjectResult = await this.projectService.createProjectWithPeople(
        projectId,
        userId,
        projectJson,
        projectPeople
      );

      switch (createProjectResult.status) {
        case CreateProjectStatus.OK:
          return res.send(createProjectResult.project);
        case CreateProjectStatus.PROJECT_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.PROJECT_ALREADY_EXISTS]);
        case CreateProjectStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateProjectAction(req: Request, res: Response) {
    try {
      const result = await this.projectService.updateProject(
        req.params.projectId,
        req.body,
        req.heyspace.authResult.userId
      );

      switch (result.status) {
        case UpdateProjectStatus.OK:
          return res.send();
        case UpdateProjectStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectAction(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const result = await this.projectService.getProjectWithMetadata(req.params.projectId, queryParams);

      switch (result.status) {
        case GetProjectWithMetadataStatus.OK:
          return res.send(result.data);
        case GetProjectWithMetadataStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addProjectPersonAction(req: Request, res: Response) {
    try {
      const result = await this.projectPeopleService.addProjectPerson(
        {
          projectId: req.params.projectId,
          userId: req.params.userId,
          role: req.body.role,
        },
        req.heyspace.authResult.userId
      );

      switch (result.status) {
        case AddProjectPersonStatus.OK:
          return res.status(HttpStatus.OK).send();
        case AddProjectPersonStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case AddProjectPersonStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case AddProjectPersonStatus.USER_ALREADY_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_PROJECT]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addProjectPersonsAction(req: Request, res: Response) {
    try {
      const result = await this.projectPeopleService.addProjectPersons(req.body.people, req.heyspace.authResult.userId);

      switch (result.status) {
        case AddProjectPersonsStatus.OK:
          return res.status(HttpStatus.OK).send();
        case AddProjectPersonsStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case AddProjectPersonsStatus.USER_ALREADY_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_PROJECT]);
        case AddProjectPersonsStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectPersonsAction(req: Request, res: Response) {
    try {
      const result = await this.projectPeopleService.getProjectPersons(req.params.projectId);

      switch (result.status) {
        case GetProjectPersonsStatus.OK:
          return res.send(result.projectPeople);
        case GetProjectPersonsStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateProjectPersonAction(req: Request, res: Response) {
    try {
      const result = await this.projectPeopleService.updateProjectPeopleRole({
        projectId: req.params.projectId,
        userId: req.params.userId,
        role: req.body.role,
      });

      switch (result.status) {
        case UpdateProjectPeopleRoleStatus.OK:
          return res.status(HttpStatus.OK).send();
        case UpdateProjectPeopleRoleStatus.PROJECT_PEOPLE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_PEOPLE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteProjectPersonAction(req: Request, res: Response) {
    try {
      const result = await this.projectPeopleService.deleteProjectPeopleRole(
        req.params.projectId,
        req.params.userId,
        req.heyspace.authResult.userId
      );

      switch (result.status) {
        case DeleteProjectPeopleRoleStatus.OK:
          return res.status(HttpStatus.OK).send();
        case DeleteProjectPeopleRoleStatus.PROJECT_PEOPLE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_PEOPLE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectListsAction(req: Request, res: Response) {
    try {
      const result = await this.listService.getProjectListsAndListsFollowers(req.params.projectId);

      switch (result.status) {
        case GetProjectListsAndListsFollowersStatus.OK:
          return res.status(HttpStatus.OK).send(result.data);
        case GetProjectListsAndListsFollowersStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectTasksAction(req: Request, res: Response) {
    try {
      const result = await this.projectTasksService.getProjectTasksWithMetadata(
        req.params.projectId,
        req.query as unknown as ProjectTasksQueryParams
      );

      switch (result.status) {
        case GetProjectTasksWithMetadataStatus.OK:
          return res.status(HttpStatus.OK).send(result.data);
        case GetProjectTasksWithMetadataStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addProjectFollowerAction(req: Request, res: Response) {
    try {
      const result = await this.projectFollowersService.addProjectFollower(req.params.projectId, req.params.userId);

      switch (result.status) {
        case AddProjectFollowerStatus.OK:
          return res.status(HttpStatus.OK).send();
        case AddProjectFollowerStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case AddProjectFollowerStatus.USER_ALREADY_FOLLOWING_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_FOLLOWING_PROJECT]);
        case AddProjectFollowerStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteProjectFollowerAction(req: Request, res: Response) {
    try {
      const result = await this.projectFollowersService.removeProjectFollower(req.params.projectId, req.params.userId);

      switch (result.status) {
        case RemoveProjectFollowerStatus.OK:
          return res.status(HttpStatus.OK).send();
        case RemoveProjectFollowerStatus.PROJECT_FOLLOWER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_FOLLOWER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getConversation(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const { people } = req.query as { people: string };
      const peopleArray = people.split(',');
      const conversation = await this.conversationService.getConversation(organizationId, peopleArray);

      let conversationPeopleRole = undefined;
      if (conversation) {
        conversationPeopleRole = await this.projectPeopleService.getProjectPeople(conversation.id);
      }

      if (!conversation) {
        res.send(ErrorDefinitions[Type.CONVERSATION_NOT_FOUND]);
      } else {
        res.status(HttpStatus.OK).send({
          conversation,
          peopleRole: conversationPeopleRole,
        });
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateConversationSettings(req: Request, res: Response) {
    try {
      const result = await this.conversationService.updateConversationSettings(
        req.heyspace.authResult.userId,
        req.params.conversationHash,
        req.params.organizationId,
        req.body
      );

      switch (result.status) {
        case UpdateConversationSettingsResultStatus.OK:
          return res.status(HttpStatus.OK).send();
        case UpdateConversationSettingsResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case UpdateConversationSettingsResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getArchivedProjectsViewData(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const userId = req.heyspace.authResult.userId;
      const result = await this.projectService.getUserArchivedProjectsViewData(organizationId, userId);

      switch (result.status) {
        case GetUserArchivedProjectsViewDataStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case GetUserArchivedProjectsViewDataStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case GetUserArchivedProjectsViewDataStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserProjectSettings(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { userId } = req.heyspace.authResult;

      const result = await this.projectSettingsProvider.getUserProjectSettings(userId, projectId);

      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async setUserProjectSettings(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const projectSettingsJson = req.body;
      const { userId } = req.heyspace.authResult;

      const result = await this.projectSettingsProvider.setUserProjectSettings(userId, projectId, projectSettingsJson);

      switch (result.status) {
        case SetUserProjectSettingsStatus.OK:
          return res.status(HttpStatus.OK).send(result);
        case SetUserProjectSettingsStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case SetUserProjectSettingsStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async copySpaceAction(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { name } = req.body;
      const { userId } = req.heyspace.authResult;

      const result = await this.projectService.copySpaceWithChildren(projectId, userId, name);

      switch (result.status) {
        case CopySpaceStatus.OK:
          return res.send();
        case CopySpaceStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async setProjectLatestVisit(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { userId } = req.heyspace.authResult;
      const result = await this.projectService.setProjectLatestVisit(userId, projectId);
      switch (result.status) {
        case SetProjectLatestVisitStatus.OK:
          return res.status(HttpStatus.OK).send();
        case SetProjectLatestVisitStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case SetProjectLatestVisitStatus.USER_NOT_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_PROJECT]);
        case SetProjectLatestVisitStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectAttachments(req: Request, res: Response) {
    try {
      const { projectId } = req.params;

      const result = await this.projectService.getProjectAttachments(projectId);
      switch (result.status) {
        case GetProjectAttachmentsStatus.OK:
          return res.status(HttpStatus.OK).send(result.attachments);
        case GetProjectAttachmentsStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createProjectFileAction(req: Request, res: Response) {
    try {
      const { userId } = req.heyspace.authResult;
      const { projectId } = req.params;
      const { fileId } = req.body;
      const result = await this.projectService.createProjectFile(projectId, fileId, userId);

      switch (result.status) {
        case CreateProjectFileStatus.OK:
          return res.status(HttpStatus.OK).send(result.projectFile);
        case CreateProjectFileStatus.FILE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.FILE_NOT_FOUND]);
        case CreateProjectFileStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case CreateProjectFileStatus.USER_NOT_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_PROJECT]);
        case CreateProjectFileStatus.FILE_NOT_OWNED_BY_USER:
          return res.send(ErrorDefinitions[Type.FILE_NOT_OWNED_BY_USER]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

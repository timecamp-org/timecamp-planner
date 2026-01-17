import { Request, Response } from 'express';
import {
  CreatePersonalProjectGroupResultStatus,
  DeletePersonalProjectGroupResultStatus, ProjectGroupJson,
  ProjectPersonalContainerType,
  UpdateOrganizationProjectOrderResultStatus,
  UpdatePersonalProjectGroupResultStatus
} from '../modules/projectPersonalStructure/types';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { LoggerInterface } from '../../../infrastructure/logger';
import { inject, injectable } from 'inversify';
import { ProjectPersonalStructureModule } from '../modules/projectPersonalStructure/ProjectPersonalStructureModule';
import { PersonalProjectGroupServiceInterface } from '../modules/projectPersonalStructure/interfaces/PersonalProjectGroupServiceInterface';
import { PersonalProjectOrderServiceInterface } from '../modules/projectPersonalStructure/interfaces/PersonalProjectOrderServiceInterface';
import { ProjectPersonalStructureResource } from '../modules/projectPersonalStructure/resources/ProjectPersonalStructureResource';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

@injectable()
export class ProjectPersonalStructureController {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectGroupServiceInterface)
    private personalProjectGroupService: PersonalProjectGroupServiceInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectOrderServiceInterface)
    private personalProjectOrderService: PersonalProjectOrderServiceInterface,
    @inject(ProjectPersonalStructureModule.ProjectPersonalStructureResource)
    private projectPersonalStructureResource: ProjectPersonalStructureResource
  ) {}

  async getProjectPersonalStructureAction(req: Request, res: Response) {
    const { userId } = req.heyspace.authResult
    const { organizationId } = req.params
    try {
      const result = await this.projectPersonalStructureResource.getData(undefined, {
        userId,
        organizationId,
      })
      res.send(result)
    } catch(error) {
      this.logger.debug(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async updatePersonalProjectOrderAction(req: Request, res: Response) {
    const { userId } = req.heyspace.authResult
    const { organizationId, projectId} = req.params
    const {
      order,
      containerType,
      containerId,
    } = req.body

    try {
      const result = await this.personalProjectOrderService.updatePersonalProjectOrder({
        userId,
        organizationId,
        projectId,
        order,
        targetContainerType: containerType as ProjectPersonalContainerType,
        targetContainerId: containerId,
      })

      switch (result.status) {
        case UpdateOrganizationProjectOrderResultStatus.OK:
          return res.send()
        case UpdateOrganizationProjectOrderResultStatus.USER_NOT_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION])
        case UpdateOrganizationProjectOrderResultStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND])
        case UpdateOrganizationProjectOrderResultStatus.MISSING_PARAMETER:
          return res.send(ErrorDefinitions[Type.MISSING_BODY_PARAMETER])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.debug(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async createPersonalProjectGroupAction(req: Request, res: Response) {
    try {
      const result = await this.personalProjectGroupService.createPersonalProjectGroup(
        req.body as ProjectGroupJson,
      )
      switch (result.status) {
        case CreatePersonalProjectGroupResultStatus.OK:
          return res.send(result);
        case CreatePersonalProjectGroupResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case CreatePersonalProjectGroupResultStatus.USER_NOT_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION]);
        case CreatePersonalProjectGroupResultStatus.MALFORMED_REQUEST_CONTENT:
          return res.send(ErrorDefinitions[Type.MISSING_BODY_PARAMETER]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch(error) {
      this.logger.debug(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async updatePersonalProjectGroupAction(req: Request, res: Response) {
    try {
      const result = await this.personalProjectGroupService.updatePersonalProjectGroup(
        req.params.groupId,
        req.body as ProjectGroupJson,
      )

      switch (result.status) {
        case UpdatePersonalProjectGroupResultStatus.OK:
          return res.send(result);
        case UpdatePersonalProjectGroupResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case UpdatePersonalProjectGroupResultStatus.USER_NOT_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION]);
        case UpdatePersonalProjectGroupResultStatus.MISSING_PARAMETER:
          return res.send(ErrorDefinitions[Type.MISSING_BODY_PARAMETER]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch(error) {
      this.logger.debug(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async deletePersonalProjectGroupAction(req: Request, res: Response) {
    try {
      const result = await this.personalProjectGroupService.deletePersonalProjectGroup(
        req.params.groupId,
      )

      switch (result.status) {
        case DeletePersonalProjectGroupResultStatus.OK:
          return res.send(result);
        case DeletePersonalProjectGroupResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case DeletePersonalProjectGroupResultStatus.USER_NOT_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION]);
        case DeletePersonalProjectGroupResultStatus.PROJECT_GROUP_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_GROUP_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch(error) {
      this.logger.debug(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

}
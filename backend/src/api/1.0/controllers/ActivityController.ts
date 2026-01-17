import { Request, Response } from 'express';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import logger from '../../../infrastructure/logger';
import { GetActivitiesResultStatus } from '../modules/activities/types';
import { injectable, inject } from 'inversify';
import { ActivitiesModule } from '../modules/activities/ActivitiesModule';
import { ActivityServiceInterface } from '../modules/activities/interfaces/ActivityServiceInterface';
import { ContainerType } from '../modules/db/schema';

@injectable()
export class ActivityController {
  private activityService: ActivityServiceInterface;

  constructor(
    @inject(ActivitiesModule.ActivityServiceInterface)
    activityService: ActivityServiceInterface
  ) {
    this.activityService = activityService;
  }

  async getActivitiesAction(req: Request, res: Response) {
    try {
      const { containerType, containerId } = req.params;
      const { page, limit } = req.query as unknown as { page: string; limit: number };
      const result = await this.activityService.getActivities(containerType as ContainerType, containerId, page, limit);

      switch (result.status) {
        case GetActivitiesResultStatus.PROJECT_NOT_FOUND: {
          res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
          break;
        }
        case GetActivitiesResultStatus.TASK_NOT_FOUND: {
          res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
          break;
        }
        case GetActivitiesResultStatus.NOT_IMPLEMENTED_CONTAINER_TYPE: {
          res.send(ErrorDefinitions[Type.NOT_IMPLEMENTED_CONTAINER_TYPE]);
          break;
        }
        default: {
          res.send(result.activities);
        }
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

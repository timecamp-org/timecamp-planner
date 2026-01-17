import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { TimeCampModule } from '../modules/timeCamp/TimeCampModule';
import { TimeCampServiceInterface } from '../modules/timeCamp/interfaces/TimeCampServiceInterface';
import {
  CreateTimeEntryStatus,
  GetTimeEntriesStatus,
  HasTokenStatus,
  TimeEntry,
  TimerActionStatus,
} from '../modules/timeCamp/types';

@injectable()
export class TimeCampController {
  constructor(
    @inject(TimeCampModule.TimeCampServiceInterface)
    private timeCampService: TimeCampServiceInterface
  ) {
    this.timeCampService = timeCampService;
  }

  async timerAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { taskId, action } = req.body;

      const result = await this.timeCampService.timerAction({
        action,
        userId,
        taskId,
      });

      switch (result.status) {
        case TimerActionStatus.OK:
          return res.send(result.timerActionResult);
        case TimerActionStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        case TimerActionStatus.TOKEN_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TOKEN_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async hasTokenAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { organizationId } = req.body;

      const result = await this.timeCampService.hasToken({
        userId,
        organizationId,
      });

      switch (result.status) {
        case HasTokenStatus.OK:
          return res.send();
        case HasTokenStatus.TOKEN_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TOKEN_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createTimeEntryAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;

      const result = await this.timeCampService.createTimeEntry({
        userId,
        ...req.body,
      });

      switch (result.status) {
        case CreateTimeEntryStatus.OK:
          return res.send(result.timeEntryId);
        case CreateTimeEntryStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        case CreateTimeEntryStatus.TOKEN_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTimeEntries(req: Request<{ taskId: string }, TimeEntry[], {}, {}>, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;

      const result = await this.timeCampService.getTimeEntries({
        userId,
        ...req.params,
      });

      switch (result.status) {
        case GetTimeEntriesStatus.OK:
          return res.send(result.timeEntries);
        case GetTimeEntriesStatus.TOKEN_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TOKEN_NOT_FOUND]);
        case GetTimeEntriesStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

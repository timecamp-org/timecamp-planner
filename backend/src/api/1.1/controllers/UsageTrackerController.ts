import { Request, Response } from 'express';

import { inject, injectable } from 'inversify';
import logger from '../../../infrastructure/logger';
import { AnalyticsModule } from '../modules/analytics/AnalyticsModule';
import { UsageTrackerServiceInterface } from '../modules/analytics/interfaces/UsageTrackerServiceInterface';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';

@injectable()
export class UsageTrackerController {
  private usageTrackerService: UsageTrackerServiceInterface;

  constructor(
    @inject(AnalyticsModule.UsageTrackerServiceInterface)
    usageTrackerService: UsageTrackerServiceInterface
  ) {
    this.usageTrackerService = usageTrackerService;
  }

  async handleUsageTrackerEventsAction(req: Request, res: Response) {
    try {
      const result = await this.usageTrackerService.handleUsageTrackerEvents(
        req.body.events,
        req.heyspace.authResult.userId,
        req.clientIp
      );
      res.json(result);
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

import { inject, injectable } from 'inversify'
import { AnalyticsModule } from '../modules/analytics/AnalyticsModule'
import { Request, Response } from 'express'
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import { HttpStatus } from '../../../infrastructure/enum'
import logger from '../../../infrastructure/logger'
import { AnalyticsServiceInterface } from '../modules/analytics/interfaces/AnalyticsServiceInterface'
import { SetUserFeedbackStatus } from '../modules/analytics/types'

@injectable()
export class AnalyticsController {
  protected analyticsService: AnalyticsServiceInterface

  constructor(
    @inject(AnalyticsModule.AnalyticsServiceInterface)
      analyticsService: AnalyticsServiceInterface
  ) {
    this.analyticsService = analyticsService
  }

  async setUserFeedback(req: Request, res: Response) {
    try {
      const { feedback, feedbackType } = req.body
      const { userId } = req.heyspace.authResult

      const status = await this.analyticsService.setUserFeedback(userId, feedbackType, feedback)

      switch (status) {
        case SetUserFeedbackStatus.USER_NOT_FOUND: {
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        }
        case SetUserFeedbackStatus.OK: {
          return res.status(HttpStatus.OK).send()
        }
        default: {
          return res.send(ErrorDefinitions[Type.INTERNAL])
        }
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }
}
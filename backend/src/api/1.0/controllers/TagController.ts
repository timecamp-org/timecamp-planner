import { Request, Response } from 'express';

import {
  CreateTagResultStatus,
  UpdateTagResultStatus,
  DeleteTagResultStatus,
  GetTagsUsageStatisticsResultStatus
} from '../modules/tags/types';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { injectable, inject } from 'inversify';
import { TagsModule } from '../modules/tags/TagsModule';
import { TagServiceInterface } from '../modules/tags/TagServiceInterface';
import { IdGeneratorInterface, Id } from '../modules/common/identifier';
import { CommonModule } from '../modules/common/CommonModule';

@injectable()
export class TagController {

  private tagService: TagServiceInterface
  private idGenerator: IdGeneratorInterface<Id>

  constructor(
    @inject(TagsModule.TagServiceInterface)
      tagService: TagServiceInterface,
    @inject(CommonModule.IdGeneratorInterface)
      idGenerator: IdGeneratorInterface<Id>,
  ) {
    this.tagService = tagService
    this.idGenerator = idGenerator
  }

  async createTagAction(req: Request, res: Response) {
    try {
      const tagId = req.params.tagId || this.idGenerator.generateId()
      const tagCreateResult = await this.tagService.createTag(tagId, req.body);

      switch (tagCreateResult.status) {
        case CreateTagResultStatus.OK:
          return res.send(tagCreateResult.tag);
        case CreateTagResultStatus.TAG_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.TAG_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateTagAction(req: Request, res: Response) {
    try {
      const tagUpdateResult = await this.tagService.updateTag(req.params.tagId, req.body);

      switch (tagUpdateResult.status) {
        case UpdateTagResultStatus.OK:
          return res.send();
        case UpdateTagResultStatus.TAG_NOT_EXISTS:
          return res.send(ErrorDefinitions[Type.TAG_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteTagAction(req: Request, res: Response) {
    try {
      const tagDeleteResult = await this.tagService.deleteTag(req.params.tagId);

      switch (tagDeleteResult.status) {
        case DeleteTagResultStatus.OK:
          return res.send();
        case DeleteTagResultStatus.TAG_NOT_EXISTS:
          return res.send(ErrorDefinitions[Type.TAG_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTagsUsageStatisticsAction(req: Request, res: Response) {
    try {
      const tagsUsageInTaksResult = await this.tagService.getTagsUsageStatistics(req.params.organizationId);

      switch (tagsUsageInTaksResult.status) {
        case GetTagsUsageStatisticsResultStatus.OK:
          return res.send(tagsUsageInTaksResult)
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

}

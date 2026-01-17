import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { SearchModule } from '../modules/search/SearchModule';
import { SearchServiceInterface } from '../modules/search/interfaces/SearchServiceInterface';
import { SearchMessageStatus } from '../modules/search/types';
import { Id } from '../modules/common/identifier';
import { EntityType } from '../modules/common/enum';

type SearchActionRequestType = Request<
  { organizationId: Id },
  any,
  any,
  {
    searchPhrase: string;
    page: string;
    limit: string;
    entityType: EntityType;
    archived: string;
    treshold: string;
  },
  Record<string, any>
>;
@injectable()
export class SearchController {
  constructor(
    @inject(SearchModule.SearchServiceInterface)
    private searchService: SearchServiceInterface
  ) {}

  async searchAction(req: SearchActionRequestType, res: Response) {
    try {
      const { searchPhrase, page, limit, entityType, archived } = req.query;

      const userId = req.heyspace.authResult.userId;

      const { organizationId } = req.params;

      const { status, results } = await this.searchService.searchEntities({
        searchPhrase: searchPhrase as string,
        page,
        limit: limit as unknown as number,
        entityType,
        organizationId,
        archived: archived as unknown as boolean,
        userId,
      });

      switch (status) {
        case SearchMessageStatus.OK:
          return res.send(results);
        case SearchMessageStatus.MESSAGE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.MESSAGE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

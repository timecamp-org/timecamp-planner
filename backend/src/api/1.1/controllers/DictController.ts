import { inject, injectable } from 'inversify';

import { Request, Response } from 'express';
import { DictModule } from '../../1.1/modules/dict/DictModule';
import { DictService } from '../../1.1/modules/dict/DictService';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../../1.0/modules/common/ErrorDefinitions';

import { convertDictionaryTypeToTable } from '../../1.1/modules/dict/utils';
import { DictionaryTypes } from '../../1.1/modules/dict/types';

@injectable()
export class DictController {
  constructor(
    @inject(DictModule.DictServiceInterface)
    protected dictService: DictService
  ) {}

  public async getDictionaryAction(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const result = convertDictionaryTypeToTable(name as DictionaryTypes);
      const dictResult = await this.dictService.getDict(result);

      return res.send(dictResult);
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
  public async getDictionaryNamesAction(req: Request, res: Response) {
    try {
      const types = Object.values(DictionaryTypes);

      return res.send(types);
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
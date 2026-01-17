import * as Joi from 'joi'
import { ValidationDefinitionName, ValidatorDefinitions } from '../api/1.0/modules/common/validator/types';

const uuidString = Joi.string().guid()

const definitions: ValidatorDefinitions = {
  [ValidationDefinitionName.PERSONAL_PROJECT_GROUP]: Joi.object().keys({
    id: uuidString.required(),
    userInOrganizationId: uuidString.required(),
    name: Joi.string().required(),
    order: Joi.number().required(),
    isExpanded: Joi.boolean(),
  })
};

export default definitions

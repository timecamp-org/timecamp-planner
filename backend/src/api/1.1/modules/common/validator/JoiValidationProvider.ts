import { ValidationProviderInterface } from "./interfaces/ValidationProviderInterface";
import { AnyDict } from "../types";
import { injectable } from "inversify";
import * as Joi from 'joi'
import { ValidationSchema } from "./types";

@injectable()
export class JoiValidationProvider implements ValidationProviderInterface {
  async validate(object: AnyDict, schema: ValidationSchema) {
    return new Promise((resolve, reject) => {
      Joi.validate(object, schema, (error, value) => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      })
    })
  }

}

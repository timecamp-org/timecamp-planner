import { AnyDict } from "../../types";
import { ValidationSchema } from "../types";

export interface ValidationProviderInterface {
  validate(object: AnyDict, schema: ValidationSchema): any;
}

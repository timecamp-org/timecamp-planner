import { ValidationResult, ValidationDefinitionName } from "../types";
import { AnyDict } from "../../types";

export interface ValidatorInterface {
  validateObject(definitionName: ValidationDefinitionName, object: AnyDict): PromiseLike<ValidationResult>;
}

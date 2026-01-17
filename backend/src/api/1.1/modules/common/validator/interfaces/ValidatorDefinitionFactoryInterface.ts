import { ValidationDefinitionName, ValidationSchema } from "../types";
import { Maybe } from "../../types";

export interface ValidatorDefinitionFactoryInterface {
  getDefinition(definitionName: ValidationDefinitionName): Maybe<ValidationSchema>;
}

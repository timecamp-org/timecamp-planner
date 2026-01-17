import { ValidatorDefinitionFactoryInterface } from "./interfaces/ValidatorDefinitionFactoryInterface";
import { injectable, inject } from "inversify";
import { ValidationDefinitionName, ValidatorDefinitions, ValidationSchema } from "./types";
import { CommonModule } from "../CommonModule";
import { Maybe } from "../types";

@injectable()
export class ValidatorDefinitionFactory implements ValidatorDefinitionFactoryInterface {
  private definitions: ValidatorDefinitions;
  constructor(
    @inject(CommonModule.ValidatorDefinitions) 
    definitions: ValidatorDefinitions
  ) {
    this.definitions = definitions;
  }
  getDefinition(definitionName: ValidationDefinitionName): Maybe<ValidationSchema> {
    if(!this.definitions) {
      return null
    }
    const schema = this.definitions[definitionName];
    return schema;
  }
}

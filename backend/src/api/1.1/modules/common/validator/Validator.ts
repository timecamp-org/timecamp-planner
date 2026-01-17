import { ValidatorInterface } from './interfaces/ValidatorInterface';
import { ValidationResult, ValidationStatus, ValidationDefinitionName } from './types';
import { AnyDict } from '../types';
import { injectable, inject } from 'inversify';
import { ValidatorDefinitionFactoryInterface } from './interfaces/ValidatorDefinitionFactoryInterface';
import { CommonModule } from '../CommonModule';
import { ValidationProviderInterface } from './interfaces/ValidationProviderInterface';
@injectable()
export class Validator implements ValidatorInterface {
  private validatorDefinitionFactory: ValidatorDefinitionFactoryInterface;
  private validationProvider: ValidationProviderInterface;

  constructor(
    @inject(CommonModule.ValidatorDefinitionFactoryInterface)
    validatorDefinitionFactory: ValidatorDefinitionFactoryInterface,
    @inject(CommonModule.ValidationProviderInterface)
    validationProvider: ValidationProviderInterface
  ) {
    this.validatorDefinitionFactory = validatorDefinitionFactory;
    this.validationProvider = validationProvider;
  }

  async validateObject(definitionName: ValidationDefinitionName, object: AnyDict): Promise<ValidationResult> {
    const definition = this.validatorDefinitionFactory.getDefinition(definitionName);

    if (!definition) {
      return {
        status: ValidationStatus.DEFINITION_NOT_FOUND,
      };
    }

    try {
      await this.validationProvider.validate(object, definition);
    } catch (error) {
      return {
        status: ValidationStatus.VALIDATION_FAILED,
        message: error.message,
      };
    }

    return {
      status: ValidationStatus.OK,
    };
  }
}

import { AnyDict } from "../types";



export enum ValidationStatus {
  OK,
  DEFINITION_NOT_FOUND,
  VALIDATION_FAILED,
}

export type ValidationResult = {
  status: ValidationStatus,
  message?: string,
}

export enum ValidationDefinitionName {
  PAYMENT_DATA,
  PERSONAL_PROJECT_GROUP,
}

export type ValidatorDefinitions = {
  [definitionName: string]: ValidationSchema,
}

export type ValidationSchema = AnyDict

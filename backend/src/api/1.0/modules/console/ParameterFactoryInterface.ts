import { CommandParameters } from './types'

export interface ParameterFactoryInterface
{
  parseArgv(argv: string[]) : CommandParameters;
}
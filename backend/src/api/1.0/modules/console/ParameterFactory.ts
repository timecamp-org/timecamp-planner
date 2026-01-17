import { ParameterFactoryInterface } from './ParameterFactoryInterface'
import { CommandParameters } from './types'
import { injectable } from 'inversify'

@injectable()
export class ParameterFactory
  implements ParameterFactoryInterface
{
  parseArgv(argv: string[]): CommandParameters {

    const params : CommandParameters = {
      options: {},
      params: []
    }

    argv.forEach(arg => {
      if (arg[0] === '-') {
        // Option
        //TODO PARSE OPTIONS
      } else {
        // Param
        params.params.push(arg);
      }
    })

    return params;
  }
}
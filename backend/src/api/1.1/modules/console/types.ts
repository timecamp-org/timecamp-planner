import { ConsoleCommandInterface } from './ConsoleCommandInterface'
import { AnyDict } from '../common/types'
import { interfaces } from 'inversify'
import ServiceIdentifier = interfaces.ServiceIdentifier

export interface CommandDescriptor {
  description?: string,
  serviceId: ServiceIdentifier<ConsoleCommandInterface>,
}

export interface CommandConfig extends CommandDescriptor {
  name: string,
}

export type CommandRegistry = {
  [commandName: string] : CommandDescriptor
}

/**
 * Option examples:
 *  script.js -f
 *  script.js --foo=something
 *
 * Param examples:
 *  script.js input.file
 *
 * Both:
 *  script.js --verbose --skip=10 inputFile.txt outputFile.txt
 */
export type CommandParameters = {
  options: AnyDict,
  params: string[],
}
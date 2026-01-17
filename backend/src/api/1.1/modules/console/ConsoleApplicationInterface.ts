import { CommandConfig, CommandDescriptor, CommandParameters } from './types'

export interface ConsoleApplicationInterface
{
  registerCommand(name: string, descriptor: CommandDescriptor);
  run(commandName: string, params: CommandParameters) : PromiseLike<void>;
  getCommandDefinitions() : CommandConfig[]
}
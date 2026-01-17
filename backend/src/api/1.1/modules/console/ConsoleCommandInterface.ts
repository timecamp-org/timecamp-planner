import { CommandParameters } from './types'
import { OutputInterface } from './OutputInterface'

export interface ConsoleCommandInterface
{
  execute(params: CommandParameters, output: OutputInterface) : PromiseLike<void>;
}
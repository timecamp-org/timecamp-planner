import { LoggerInterface } from '../../../../infrastructure/logger'

export interface CronTabJobInterface
{
  run(logger: LoggerInterface) : PromiseLike<void>;
  
  getJobKey(): string; 
}
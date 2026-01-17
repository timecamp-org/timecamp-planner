import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { CronTabInterface } from './CronTabInterface'
import { CronModule } from './CronModule'
import { CronTab } from './CronTab'

export const cronModule : ModuleLoaderType = kernel => {
  kernel
    .bind<CronTabInterface>(CronModule.CronTabInterface)
    .to(CronTab)
  ;
}
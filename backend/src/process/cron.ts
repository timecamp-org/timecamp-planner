// Import required at top-level by inversify-js package. Don't ask why.. No idea.
import 'reflect-metadata';
import { CronModule } from '../api/1.0/modules/cron/CronModule';
import { CronTabInterface } from '../api/1.0/modules/cron/CronTabInterface';
import { theKernel } from '../services';
import config from '../config/config';
import { CronTabJobInterface } from '../api/1.0/modules/cron/CronTabJobInterface';
import { ProcessEventType } from '../infrastructure/types';

const cronTab = theKernel.get<CronTabInterface>(CronModule.CronTabInterface);

config.cron.tab.forEach((entry) => {
  const job = theKernel.get<CronTabJobInterface>(entry.job);
  cronTab.schedule(job, entry.schedule);
});

cronTab.start();

process.on(ProcessEventType.SIGINT, () => {
  console.log('Received SIGINT. Initiating graceful shutdown...');
  cronTab.stop().then(() => {
    console.log('All cron jobs finished. Graceful shutdown successful.');
    process.exit(0);
  });
});

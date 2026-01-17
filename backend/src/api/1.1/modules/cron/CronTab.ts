import { CronTabInterface } from './CronTabInterface'
import { CronTabJobInterface } from './CronTabJobInterface'
import { CronScheduleInterface } from './CronScheduleInterface'
import { SchedulerInterface } from '../common/scheduler/SchedulerInterface'
import { IntervalHandle, TimeoutHandle } from '../common/scheduler/types'
import { inject, injectable, multiInject, optional } from 'inversify'
import { CommonModule } from '../common/CommonModule'
import { CronTabEntry, CronTabHandle } from './types'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'
import { LoggerInterface, TagLoggerDecorator, TagLoggerFactory } from '../../../../infrastructure/logger'
import { CronModule } from './CronModule'
import { RandomSourceInterface } from '../common/RandonSourceInterface'

@injectable()
export class CronTab
implements CronTabInterface
{
  public static readonly JOB_ID_LEN = 8;
  
  protected intervalMs : number = 60000;
  protected intervalHandle? : IntervalHandle;
  protected timeoutHandle? : TimeoutHandle;
  protected scheduler : SchedulerInterface
  protected handles : CronTabHandle[];
  protected timeService: TimeServiceInterface;
  protected logger: LoggerInterface;
  protected randomSource : RandomSourceInterface;
  protected loggerFactory: TagLoggerFactory

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    
    @inject(CommonModule.SchedulerInterface)
      scheduler: SchedulerInterface,
    
    @inject(CommonModule.TimeServiceInterface)
      timeService: TimeServiceInterface,
    
    @inject(CommonModule.RandomSourceInterface)
      randomSource: RandomSourceInterface,
    
    @optional() @multiInject(CronModule.CronTabEntry)
      entries?: CronTabEntry[],
  ) {
    this.logger = logger;
    this.loggerFactory = new TagLoggerFactory(logger);
    this.scheduler = scheduler;
    this.timeService = timeService;
    this.handles = [];
    this.randomSource = randomSource;
    
    if (entries) {
      this.scheduleArray(entries);
    }
  }

  schedule(job: CronTabJobInterface, schedule: CronScheduleInterface) {
    this.logger.info(`Scheduling job [${job.getJobKey()}]`);
    const currentIndex = this.handles.findIndex(e => e.job === job);
   
    if (currentIndex >= 0) {
      this.handles[currentIndex].schedule = schedule;
    } else {
      const handle : CronTabHandle = {
        job,
        schedule,
        logger: this.loggerFactory.create(job.getJobKey()),
      };
      this.handles.push(handle);
    }
  }

  scheduleArray(entries: CronTabEntry[]) {
    entries.forEach(e => this.schedule(e.job, e.schedule));
  }

  start() {
    if (this.intervalHandle || this.timeoutHandle) {
      // Already running.
      this.logger.info('Not starting cron -- already started');
      return;
    }
    const now = this.timeService.getCurrentTime();
    const fullMinuteInMs = 60000 - now.getSeconds() * 1000 - now.getMilliseconds();
    this.logger.info('Cron starting. Scheduled firstTick()');
    this.timeoutHandle = this.scheduler.setTimeout(fullMinuteInMs, this.firstTick.bind(this));
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping crontab...');
    if (this.intervalHandle) {
      this.logger.debug('Clearing interval handler');
      this.scheduler.clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    if (this.timeoutHandle) {
      this.logger.debug('Clearing first tick handler');
      this.scheduler.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    
    const runningPromises : PromiseLike<void>[] = this.handles
      .map(entry => entry.runningPromise)
      .filter(p => !!p)
    ;
    
    if (runningPromises.length === 0) {
      this.logger.debug('No jobs running. Exiting.');
      return;
    }
    
    this.logger.info(`Waiting for ${runningPromises.length} jobs to finish before exit...`);
    
    await Promise.all(runningPromises);
  }

  unregister(job: CronTabJobInterface) {
    const jobIndex = this.handles.findIndex(e => e.job === job);
    if (jobIndex < 0) {
      // No such job. Exception?
      return;
    }
    this.handles.splice(jobIndex, 1);
  }

  protected firstTick()
  {
    if (!this.intervalHandle) {
      this.intervalHandle = this.scheduler.setInterval(this.intervalMs, this.tick.bind(this));
    }
    
    this.tick();
  }
  
  /**
   * Called once every minute (or more specifically: every ${this.intervalMs} milliseconds).
   */
  protected tick() {
    const now = this.timeService.getCurrentTime();
    this.logger.debug(`Tick (${now})`);
    
    const shouldRun = this.getEntriesForDate(now);
    const notCurrentlyRunning = shouldRun.filter(e => {
      if (e.runningPromise) {
        this.logger.debug('Skipping cron job -- still running');
        return false;
      }
      return true;
    });

    notCurrentlyRunning.forEach(this.runJob.bind(this)); 
  }

  protected getEntriesForDate(now: Date) : CronTabHandle[] {
    return this.handles.filter(e => e.schedule.inSchedule(now));
  }
  
  protected async runJob(entry: CronTabHandle) : Promise<void> {
    const jobId : string = this.randomSource.alnumString(CronTab.JOB_ID_LEN);
    if (entry.runningPromise) {
      throw new Error('Cannot run cron job -- previous run not finished');
    }
    this.logger.debug(`{${jobId}} starting cron job...`)
    entry.runningPromise = entry.job.run(
      new TagLoggerDecorator(
        entry.logger,
        jobId,
        '{}'
      )
    );
    await entry.runningPromise;
    entry.runningPromise = null;
    this.logger.debug(`{${jobId}} cron job finished`);
  }
}
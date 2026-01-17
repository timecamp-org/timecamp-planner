import { injectable, unmanaged } from 'inversify';
import { NotificationsSubWorkerInterface } from '../interfaces/NotificationsSubWorkerInterface';
import { NotificationsJobInterface, NotificationJobType } from '../types';

@injectable()
export abstract class AbstractNotificationsSubWorker
  implements NotificationsSubWorkerInterface
{
  protected constructor(
    @unmanaged() protected jobType: NotificationJobType,
  ) {}

  public abstract handle(job: NotificationsJobInterface): PromiseLike<void>;

  public async supports(job: NotificationsJobInterface): Promise<boolean>
  {
    return job.type === this.jobType;
  }
}

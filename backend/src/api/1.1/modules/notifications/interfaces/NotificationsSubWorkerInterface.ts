
import { NotificationsJobInterface } from '../types';

export interface NotificationsSubWorkerInterface
{
  supports(job: NotificationsJobInterface) : PromiseLike<boolean>;

  handle(job: NotificationsJobInterface) : PromiseLike<void>;
}

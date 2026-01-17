import { AbstractActivityTargetDbRow, ActivityDbRow } from '../../db/schema';

export interface ActivityNotificationHandlerInterface<TTarget extends AbstractActivityTargetDbRow>
{
  supports(activity: ActivityDbRow): PromiseLike<boolean>;

  handle(activity: ActivityDbRow, target: TTarget): PromiseLike<void>;
}

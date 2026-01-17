import { useEffect } from 'react';
import { UserTracker } from 'common/services';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { AnyDict } from 'common/types';

export const useUserTrackerEvent = (
  userTrackerEvent: UserTrackerEvent,
  params: AnyDict,
  dependencies: any[] = []
) => {
  useEffect(() => {
    UserTracker.track(userTrackerEvent, params);
  }, dependencies);
};

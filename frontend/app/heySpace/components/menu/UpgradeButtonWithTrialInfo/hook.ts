import differenceInDays from 'date-fns/difference_in_days';
import startOfDay from 'date-fns/start_of_day';

import { useSelector } from 'common/hooks/useSelector';
import { epochNow } from 'common/utils/epoch';
import {
  selectIsCurrentSubscriptionTrial,
  selectCurrentSubscriptionExpireTime,
  selectIsBillingEnabled,
} from 'models/domain/SubscriptionModel/selectors';

type UpgradeButtonWithTrialInfoHookInterface = {
  isBillingEnabled: boolean;
  isCurrentSubscriptionTrial: boolean;
  daysLeft: number;
};

export default function useComponent(): UpgradeButtonWithTrialInfoHookInterface {
  const isBillingEnabled = useSelector(selectIsBillingEnabled);
  const isCurrentSubscriptionTrial = useSelector(selectIsCurrentSubscriptionTrial);
  const expireTime = useSelector(selectCurrentSubscriptionExpireTime);

  if (!isBillingEnabled) {
    return {
      isBillingEnabled,
      isCurrentSubscriptionTrial: false,
      daysLeft: 0,
    };
  }

  const expireDay = startOfDay(expireTime);
  const today = startOfDay(epochNow());
  const daysLeft = differenceInDays(expireDay, today);

  return {
    isBillingEnabled,
    isCurrentSubscriptionTrial,
    daysLeft: daysLeft < 0 ? 0 : daysLeft,
  };
}

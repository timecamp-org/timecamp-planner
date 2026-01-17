import { useEffect } from 'react';

import { CustomerMessagingPlatform } from 'common/services';

import { useDataProvider } from './dataProvider';

export function useComponent(): void {
  const dataProvider = useDataProvider();
  const { isOrganizationPeopleRequestFinished, isSubscriptionRequestFinished, ...eventData } = dataProvider;
  useEffect(() => {
    if (isOrganizationPeopleRequestFinished && isSubscriptionRequestFinished) {
      CustomerMessagingPlatform.propagateData(eventData);
    }
  }, Object.values(dataProvider)); // <lazy-programmer>: sorry, too many dependencies to write explicitly
}

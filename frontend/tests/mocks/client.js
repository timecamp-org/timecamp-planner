import { doNothing } from 'common/utils';
module.exports = {
  statusRaporter: {
    GlobalStatus: {},
    Event: {},
    initializeRaporter: doNothing,
    getFailedReplicationsStatus: doNothing,
    reset: doNothing,
    stopListening: doNothing,
    startListening: doNothing,
    on: doNothing,
    off: doNothing,
  },
  startLiveReplication: doNothing,
  stopLiveReplication: doNothing,
  downloadLocalData: doNothing,
  userContext: {},
  entityManager: {},
  restApiClient: { Errors: { FetchError: doNothing } },
  subscriptions: {},
  userTracker: {
    track: doNothing,
    setUserId: doNothing,
    setSessionId: doNothing,
    setSubscriptionStatus: doNothing,
  },
};

import { useEffect, useState } from 'react';

import { UserContextEvents } from 'client/src/types';
import { useSelector } from 'common/hooks/useSelector';
import { UserTrackerEvent } from 'common/models/component/UserTrackerEventModel/constants';
import { UserTracker, HeySpaceClient as client } from 'common/services/index';
import getClientSession from 'common/utils/getClientSession';
import handleError from 'common/utils/handleError';
import { selectCurrentUserCurrentOrganizationRole } from 'models/domain/OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { User } from 'models/domain/UsersModel/models';
import { selectCurrentUser, selectCurrentUserOrganizationIds } from 'models/domain/UsersModel/selectors/domain';

function initClientEvents() {
  const userContextEventEmitter = client.userContext.getEventEmitter();
  client.clientErrorEmitter.on('clientError', (error) => handleError(error));
  userContextEventEmitter.on(UserContextEvents.USER_CHANGED, (user) => {
    UserTracker.setUser(user);
  });
  userContextEventEmitter.on(UserContextEvents.USER_ROLE_CHANGED, (role) => {
    UserTracker.setUserRole(role);
  });
  userContextEventEmitter.addListener(UserContextEvents.ORGANIZATION_CHANGED, (organizationId) => {
    UserTracker.setOrganizationId(organizationId);
  });
  userContextEventEmitter.on(UserContextEvents.USER_ORGANIZATIONS_CHANGED, (userOrganizationIds) => {
    UserTracker.setUserOrganizationIds(userOrganizationIds);
  });
}

export const useInitializeUserTracker = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    initClientEvents();
  }, []);

  const user = useSelector(selectCurrentUser)?.toJS() as User;
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const userRole = useSelector(selectCurrentUserCurrentOrganizationRole);
  const currentUserOrganizationIds = useSelector(selectCurrentUserOrganizationIds)?.toArray();

  useEffect(() => {
    // Moved form onInitAppModules
    // TODO S001 refactor do UserContext getUserSession ?? czy cos takiego, generalnie potrzebujemy persisten(?) storage (js obiekt, klasa) od przechowywania rzeczy zwiazanych z przegladarka
    if (user) {
      getClientSession((_, sessionId) => {
        UserTracker.setSessionId(sessionId);
      });
    }

    setIsInitialized(false);
  }, [user?.id]);

  useEffect(() => {
    client.userContext.setUser(user);
  }, [user]);

  useEffect(() => {
    client.userContext.setOrganizationId(currentOrganizationId);
  }, [currentOrganizationId]);

  useEffect(() => {
    client.userContext.setUserOrganizationIds(currentUserOrganizationIds);
  }, [currentUserOrganizationIds]);

  useEffect(() => {
    client.userContext.setUserRole(userRole);
  }, [userRole]);

  useEffect(() => {
    if (
      user &&
      currentOrganizationId &&
      currentUserOrganizationIds &&
      userRole &&
      !isInitialized
    ) {
      UserTracker.track(UserTrackerEvent.memberOnboard);
      setIsInitialized(true);
    }
  }, [user?.id, currentOrganizationId, currentUserOrganizationIds, userRole]);
};

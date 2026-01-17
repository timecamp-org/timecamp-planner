import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectCurrentlyEnabledExtensionsString } from 'models/domain/ExtensionsModel/selectors';
import {
  selectCurrentOrganizationActivePeopleWithoutBotCount,
  selectCurrentUserCurrentOrganizationRole,
} from 'models/domain/OrganizationsModel/selectors';
import {
  selectCurrentOrganizationCreatedAt,
  selectCurrentOrganizationId,
  selectCurrentOrganizationModifiedAt,
  selectCurrentOrganizationName,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';
import { getOrganizationPeople } from 'models/domain/RequestModel/constants/requestTypes';
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors';
import { SubscriptionStatus } from 'models/domain/SubscriptionModel/types';
import {
  selectCurrentUserCreatedAt,
  selectCurrentUserEmail,
  selectCurrentUserFirstName,
  selectCurrentUserId,
  selectCurrentUserLastName,
} from 'models/domain/UsersModel/selectors/domain';

export type DataProviderHookInterface = {
  currentUserId: Id;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: number;
  organizationRole: OrganizationPeopleRole;

  planName: string;
  subscriptionStatus: SubscriptionStatus;

  organizationId: Id;
  organizationName: string;
  organizationCreatedAt: number;
  organizationModifiedAt: number;
  currentMonthBill: number;
  organizationUserCount: number;
  isOrganizationPeopleRequestFinished: boolean;
  isSubscriptionRequestFinished: boolean;
  extensionsEnabled: string;
};

export function useDataProvider(): DataProviderHookInterface {
  const organizationId = useSelector((state) => selectCurrentOrganizationId(state));

  return {
    // use data
    currentUserId: useSelector((state) => selectCurrentUserId(state)),
    createdAt: useSelector((state) => selectCurrentUserCreatedAt(state)),
    firstName: useSelector((state) => selectCurrentUserFirstName(state)),
    lastName: useSelector((state) => selectCurrentUserLastName(state)),
    email: useSelector((state) => selectCurrentUserEmail(state)),
    organizationRole: useSelector((state) => selectCurrentUserCurrentOrganizationRole(state)),
    extensionsEnabled: useSelector((state) => selectCurrentlyEnabledExtensionsString(state)),

    // subscription data
    planName: '',
    subscriptionStatus: SubscriptionStatus.ACTIVE,

    // organization data
    organizationId,
    organizationName: useSelector((state) => selectCurrentOrganizationName(state)),
    organizationCreatedAt: useSelector((state) => selectCurrentOrganizationCreatedAt(state)),
    organizationModifiedAt: useSelector((state) => selectCurrentOrganizationModifiedAt(state)),
    currentMonthBill: 0,
    organizationUserCount: useSelector((state) => selectCurrentOrganizationActivePeopleWithoutBotCount(state)),

    isOrganizationPeopleRequestFinished: useSelector((state) =>
      selectIsRequestFinished(state, {
        requestType: getOrganizationPeople,
        objectId: organizationId,
      })
    ),
    isSubscriptionRequestFinished: true,
  };
}

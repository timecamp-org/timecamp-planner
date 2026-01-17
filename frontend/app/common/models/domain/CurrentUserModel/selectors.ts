import { createSelector } from 'reselect';
import * as Constants from './constants';
import { selectCurrentUser } from '../UsersModel/selectors/domain';
import {
  selectCurrentUserOrganizationRoles,
  selectCurrentOrganizationActivePeopleWithoutBotCount,
  selectIsCurrentUserCurrentOrganizationOwner,
} from '../OrganizationsModel/selectors';
import { activeSubscriptionStatuses } from '../SubscriptionModel/selectors';
import { OrganizationPeopleRole } from '../OrganizationsModel/types';
import { selectSubscriptionData } from '../SubscriptionModel/selectors/domain';
import { CurrentUserState } from './types';
import { StoreKey } from './types';

export const selectCurrentUserDomain = (state) => state.get(Constants.domain) as CurrentUserState;

export const selectIsLoggingIn = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.IS_LOGGING_IN)
);

export const onSignInActionResult = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.ON_SIGN_IN_ACTION_RESULT)
);

export const onSignInWithGoogleAccountActionResult = createSelector(
  selectCurrentUserDomain,
  (domain: CurrentUserState) => domain.get(StoreKey.ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT)
);

export const onSignInWithAppleAccountActionResult = createSelector(
  selectCurrentUserDomain,
  (domain: CurrentUserState) => domain.get(StoreKey.ON_SIGN_IN_WITH_APPLE_ACCOUNT_ACTION_RESULT)
);

export const onSignUpActionResult = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.ON_SIGN_UP_ACTION_RESULT)
);

export const onSignUpWithGoogleAccountActionResult = createSelector(
  selectCurrentUserDomain,
  (domain: CurrentUserState) => domain.get(StoreKey.ON_SIGN_UP_WITH_GOOGLE_ACCOUNT_ACTION_RESULT)
);

export const onSendEmailWithPasswordChangeLinkActionResult = createSelector(
  selectCurrentUserDomain,
  (domain: CurrentUserState) => domain.get(StoreKey.ON_SEND_EMAIL_WITH_PASSWORD_CHANGE_LINK_ACTION_RESULT)
);

export const onPasswordChangeActionResult = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.ON_PASSWORD_CHANGE_ACTION_RESULT)
);

export const onEmailChangeActionResult = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.ON_EMAIL_CHANGE_ACTION_RESULT)
);

export const onSetPasswordActionResult = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.ON_SET_PASSWORD_ACTION_RESULT)
);

export const onCheckIfEmailExistActionResult = createSelector(selectCurrentUserDomain, (domain: CurrentUserState) =>
  domain.get(StoreKey.ON_CHECK_IF_EMAIL_EXIST_ACTION_RESULT)
);

export const onInvitedUserSetPasswordActionResult = createSelector(
  selectCurrentUserDomain,
  (domain: CurrentUserState) => domain.get(StoreKey.ON_INVITED_USER_SET_PASSWORD_ACTION_RESULT)
);

export const isAuthenticated = createSelector(selectCurrentUser, (user) => (user ? true : false));

export const currentUserDateFormat = createSelector(selectCurrentUser, (user) =>
  user ? user.dateFormat : 'YYYY-MM-DD'
);

export const currentUserTimeFormat = createSelector(selectCurrentUser, (user) => (user ? user.timeFormat : 'HH:mm'));

export const selectCanCurrentUserDeleteAccount = createSelector(
  selectCurrentUserOrganizationRoles,
  selectSubscriptionData,
  selectCurrentOrganizationActivePeopleWithoutBotCount,
  selectIsCurrentUserCurrentOrganizationOwner,
  (
    currentUserOrganizationRoles,
    subscriptionData,
    currentOrganizationActivePeopleCount,
    isCurrentUserOrganizationOwner
  ) => {
    let hasAnyActiveSubscription = false;
    currentUserOrganizationRoles.map((role, organizationId) => {
      if (role === OrganizationPeopleRole.OWNER) {
        const subscription = subscriptionData.get(organizationId);
        if (subscription && activeSubscriptionStatuses.includes(subscription.status)) {
          hasAnyActiveSubscription = true;
        }
      }
    });

    if (isCurrentUserOrganizationOwner) {
      return currentOrganizationActivePeopleCount === 1 && !hasAnyActiveSubscription;
    }
    return !hasAnyActiveSubscription;
  }
);

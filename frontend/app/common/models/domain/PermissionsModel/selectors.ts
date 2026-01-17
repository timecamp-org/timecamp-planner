import { createSelector } from "reselect";
import {
  selectIsCurrentUserOrganizationGuest
} from '../OrganizationsModel/selectors';
import { selectIsWorkspaceMembersValidForSubscription } from "../SubscriptionLimitsModel/selectors";

export const selectIsSubscriptionSettingsAvailable = createSelector(
  selectIsCurrentUserOrganizationGuest,
  (isCurrentUserOrganizationGuest) => !isCurrentUserOrganizationGuest
)

export const selectIsTagsSettingsAvailable = createSelector(
  selectIsCurrentUserOrganizationGuest,
  selectIsWorkspaceMembersValidForSubscription,
  (isCurrentUserOrganizationGuest, isWorkspaceMembersValid) => !isCurrentUserOrganizationGuest && isWorkspaceMembersValid
)

export const selectIsAddonsSettingsAvailable = createSelector(
  selectIsCurrentUserOrganizationGuest,
  selectIsWorkspaceMembersValidForSubscription,
  (isCurrentUserOrganizationGuest, isWorkspaceMembersValid) => !isCurrentUserOrganizationGuest && isWorkspaceMembersValid
)

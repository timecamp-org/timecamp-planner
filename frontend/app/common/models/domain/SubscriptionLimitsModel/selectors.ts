export const selectSingleFileUploadLimit = (_state: unknown): number => Number.MAX_SAFE_INTEGER;

export const selectHasAccessToExtension = (_state: unknown): boolean => true;

export const selectHasAccessToTags = (_state: unknown): boolean => true;

export const selectUsersPerWorkspaceLimit = (_state: unknown): number => Number.MAX_SAFE_INTEGER;

export const selectCanUsersBeInvitedToWorkspace = (_state: unknown): boolean => true;

export const selectCurrentSubscriptionGuestSeatCount = (_state: unknown): number => Number.MAX_SAFE_INTEGER;

export const selectIsWorkspaceGuestSeatsAvailable = (_state: unknown): boolean => true;

export const selectCanGuestsBeInvitedToWorkspace = (_state: unknown): boolean => true;

export const selectIsWorkspaceMembersValidForSubscription = (_state: unknown): boolean => true;

export const selectExcessWorkspaceMembersForSubscription = (_state: unknown): number => 0;

import { createSelector } from "reselect";
import { selectUserStatusByUserId, selectUserStatusData } from "./domain";
import { selectCurrentUserId } from "../../UsersModel/selectors/domain";

export const selectCurrentUserStatusId = createSelector(
  selectUserStatusByUserId,
  selectCurrentUserId,
  (userStatusByUserId, userId) => userStatusByUserId.get(userId),
)

export const selectCurrentUserStatus = createSelector(
  selectUserStatusData,
  selectCurrentUserStatusId,
  (userStatusData, statusId) => userStatusData.get(statusId),
)

export const selectCurrentUserStatusTitle = createSelector(
  selectCurrentUserStatus,
  (status) => status ? status.title : '',
)

export const selectCurrentUserStatusEmojiCode = createSelector(
  selectCurrentUserStatus,
  (status) => status ? status.emojiCode : null,
)

export const selectCurrentUserStatusResetAt = createSelector(
  selectCurrentUserStatus,
  (status) => status ? status.resetAt : null,
)


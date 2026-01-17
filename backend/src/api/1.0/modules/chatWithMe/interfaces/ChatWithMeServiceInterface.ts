import { JoinOrganizationAsGuestAndCreateSpaceResult, GetBasicInvitationDataResult } from "../types";
import { Id } from "../../common/identifier";

import { CustomFieldValueDbRow } from "../../db/schema";

export interface ChatWithMeServiceInterface {
  joinOrganizationAsGuestAndCreateSpace(
    currentUserId: Id,
    token: string,
    userLanguage: string,
  ): PromiseLike<JoinOrganizationAsGuestAndCreateSpaceResult>

  getBasicInvitationData(token: string): PromiseLike<GetBasicInvitationDataResult>

  getCurrentOrganizationChatWithMeInvites(organizationId: Id, trx?: Transaction): PromiseLike<CustomFieldValueDbRow[]>
}

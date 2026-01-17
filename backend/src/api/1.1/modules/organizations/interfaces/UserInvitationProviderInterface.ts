import { UserInvitationJson } from "../types";
import { UserInvitationDbRow } from "../../db/schema";
import { Id } from "../../common/identifier";


export interface UserInvitationProviderInterface {

  createInvitation(userInvitation: UserInvitationJson, trx?: Transaction): PromiseLike<void>;

  updateInvitation(userInvitation: UserInvitationJson, trx?: Transaction): PromiseLike<UserInvitationDbRow>;

  getUserInvitation(inviterId: Id, invitedUserId: Id, organizationId: Id, trx?: Transaction): PromiseLike<UserInvitationDbRow>;

  getNotAcceptedInvitationsWithDayOffsetSentTimes(
    dayOffset: number,
    sentTimes: number,
  ): Promise<UserInvitationDbRow[]>
}

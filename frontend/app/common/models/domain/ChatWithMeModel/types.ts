import { ImmutableMap } from "../../../types";
import { Id } from "../../../utils/identifier";

export interface ChatWithMeState extends ImmutableMap<string, any> {
  userId: Id,
  organizationId: Id,
  organizationName: string,
  token: Id,
}

export type InvitationTokenJson = {
  token: Id,
  userInOrganizationId: Id,
}

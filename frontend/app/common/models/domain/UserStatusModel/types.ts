import { Id } from "../../../utils/identifier";
import { ImmutableMap } from "../../../types";
import { TypedRecord } from "typed-immutable-record";

export interface UserStatusInterface {
  id: Id,
  userId: Id,
  organizationId: Id,
  resetAt: number,
  emojiCode: string,
  title: string,
}

export interface UserStatusRecordInterface extends TypedRecord<UserStatusRecordInterface>, UserStatusInterface { }

export interface UserStatusState extends ImmutableMap<string, any> {
  userStatusData: Map<Id, UserStatusRecordInterface>,
}

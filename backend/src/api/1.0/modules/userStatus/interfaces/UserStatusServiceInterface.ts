import { Id } from "../../common/identifier";
import { SetUserStatusResult, DeleteUserStatusResult, UserStatusJson, GetOrganizationUserStatusesResult } from "../types";


export interface UserStatusServiceInterface {
  getOrganizationUserStatuses(userId: Id, organizationId: Id): PromiseLike<GetOrganizationUserStatusesResult>;
  setUserStatus(userStatusJson: UserStatusJson): PromiseLike<SetUserStatusResult>;
  doSetUserStatus(trx: Transaction, userStatusJson: UserStatusJson): PromiseLike<SetUserStatusResult>;
  deleteUserStatus(userId: Id, organizationId: Id): PromiseLike<DeleteUserStatusResult>;
}

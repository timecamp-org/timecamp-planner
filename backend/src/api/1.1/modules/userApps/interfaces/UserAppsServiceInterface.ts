import {
  UserAppJson,
  UpdateUserAppResult,
  GetUserAppsResult,
  CreateUserAppResult,
  DeleteUserAppResult,
  AddUserAppMemberResult,
  RemoveUserAppMemberResult,
  InviteUserAppMemberResult,
} from "../types";
import { Id } from "../../common/identifier";
import { AppUserRole } from "../../db/schema";

export interface UserAppsServiceInterface {

  createApp(userId: Id, appId:Id, appJson: UserAppJson): PromiseLike<CreateUserAppResult>;

  updateApp(appId: Id, appJson: UserAppJson): PromiseLike<UpdateUserAppResult>;

  deleteApp(appId: Id): PromiseLike<DeleteUserAppResult>;

  getUserApps(userId: Id): PromiseLike<GetUserAppsResult>;

  addAppMember(appId: Id, userId: Id, role: AppUserRole): PromiseLike<AddUserAppMemberResult>;

  inviteAppMember(appId: Id, email: string, role: AppUserRole): PromiseLike<InviteUserAppMemberResult>;

  removeAppMember(appId: Id, userId: Id): PromiseLike<RemoveUserAppMemberResult>;
}

import { CheckPermissionResult, PermissionType, PermissionContext } from "../types";

export interface ChainablePermissionRuleInterface {
  checkPermission(context: PermissionContext): PromiseLike<CheckPermissionResult>;
  getPermissionType(): PermissionType;
}

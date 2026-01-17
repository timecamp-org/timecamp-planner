import { PermissionContext, CheckPermissionResult } from "../types";
import { PermissionType } from "aws-sdk/clients/workmail";

export interface PermissionServiceInterface {
  checkPermission(permissionTypes: PermissionType[], context: PermissionContext): PromiseLike<CheckPermissionResult>
}

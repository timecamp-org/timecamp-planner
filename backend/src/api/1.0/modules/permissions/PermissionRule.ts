import { ChainablePermissionRuleInterface } from "./interfaces/ChainablePermissionRuleInterface";
import { PermissionType, PermissionContext, CheckPermissionResult } from "./types";

export class PermissionRule implements ChainablePermissionRuleInterface {

  protected permissionType: PermissionType;
  protected checkPermissionFn: (context: PermissionContext) => PromiseLike<CheckPermissionResult>

  constructor(
    type: PermissionType,
    checkPermissionFn: (context: PermissionContext) => PromiseLike<CheckPermissionResult>
  ) {
    this.permissionType = type,
    this.checkPermissionFn = checkPermissionFn
  }

  getPermissionType() {
    return this.permissionType
  }

  async checkPermission(context: PermissionContext): Promise<CheckPermissionResult> {
    return await this.checkPermissionFn(context)
  }

}

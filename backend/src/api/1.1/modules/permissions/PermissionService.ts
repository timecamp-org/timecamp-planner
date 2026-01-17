import { PermissionServiceInterface } from "./interfaces/PermissionServiceInterface";
import { inject, injectable } from "inversify";
import { PermissionType, PermissionContext, CheckPermissionResult } from "./types";
import { PermissionsModule } from "./PermissionsModule";
import { PermissionChainInterface } from "./interfaces/PermissionChainInterface";

@injectable()
export class PermissionService implements PermissionServiceInterface {
  private permissionChain: PermissionChainInterface;

  constructor(
    @inject(PermissionsModule.PermissionChainInterface)
    permissionChain: PermissionChainInterface,
  ) {
    this.permissionChain = permissionChain
  }

  async checkPermission(permissionTypes: PermissionType[], context: PermissionContext): Promise<CheckPermissionResult> {
    return this.permissionChain.checkPermission(permissionTypes, context)
  }
}

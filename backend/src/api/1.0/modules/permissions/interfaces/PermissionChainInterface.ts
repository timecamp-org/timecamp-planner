import { CheckPermissionResult, PermissionContext } from "../types";
import { ChainablePermissionRuleInterface } from "./ChainablePermissionRuleInterface";
import { PermissionType } from "aws-sdk/clients/workmail";

export interface PermissionChainInterface {
  registerPermissionRules(rules: ChainablePermissionRuleInterface[]): void;
  checkPermission(permissionTypes: PermissionType[], context: PermissionContext): PromiseLike<CheckPermissionResult>;
}

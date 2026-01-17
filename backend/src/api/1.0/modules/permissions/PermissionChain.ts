import { PermissionChainInterface } from "./interfaces/PermissionChainInterface";
import { injectable, inject } from "inversify";
import { PermissionType, CheckPermissionResult, PermissionContext, CheckPermissionStatus } from "./types";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { ChainablePermissionRuleInterface } from "./interfaces/ChainablePermissionRuleInterface";

@injectable()
export class PermissionChain implements PermissionChainInterface {
  private logger: LoggerInterface;
  private rules: ChainablePermissionRuleInterface[] = [];

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
  ) {
    this.logger = logger
  }

  registerPermissionRules(rules: ChainablePermissionRuleInterface[]): void {
    rules.forEach(rule => {
      this.logger.debug(`Registering permission rule: ${rule.getPermissionType()}`)
      this.rules.push(rule);
    })
  }

  async checkPermission(permissionTypes: PermissionType[], context: PermissionContext): Promise<CheckPermissionResult> {
    const filteredRules = this.getFilteredRules(permissionTypes)

    if (filteredRules.length === 0) {
      return {
        status: CheckPermissionStatus.OK,
      }
    }

    let result
    for (let i = 0; i < filteredRules.length; i++) {
      const rule = filteredRules[i]
      result = await rule.checkPermission(context)
      if (!result.isPermitted) {
        break
      }
    }
  
    return result
  }

  private getFilteredRules(permissionTypes: PermissionType[]): ChainablePermissionRuleInterface[] {
    const filteredRules = this.rules
      .filter((rule: ChainablePermissionRuleInterface) => permissionTypes.includes(rule.getPermissionType()))
      .sort((roleA, roleB) => {
        return permissionTypes.indexOf(roleA.getPermissionType()) - permissionTypes.indexOf(roleB.getPermissionType())
      })

    return filteredRules
  }
}

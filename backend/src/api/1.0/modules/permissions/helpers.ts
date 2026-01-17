import { PermissionDeniedReason, CheckPermissionResult, CheckPermissionStatus } from "./types";

export function createPermissionResult(isPermitted: boolean, reason?: PermissionDeniedReason): CheckPermissionResult {
  return {
    status: getPermissionStatus(isPermitted),
    reason: isPermitted ? null : reason,
  }
}

export function createPermissionResultConditional(permissionResults: CheckPermissionResult[]): CheckPermissionResult {
  const deniedPermission = permissionResults.find(result => result.status !== CheckPermissionStatus.OK)

  if (deniedPermission) {
    return deniedPermission
  } else {
    return {
      status: CheckPermissionStatus.OK
    }
  }
}

export function getPermissionStatus(isPermitted: boolean): CheckPermissionStatus {
  return isPermitted ? CheckPermissionStatus.OK : CheckPermissionStatus.NOT_PERMITTED
}

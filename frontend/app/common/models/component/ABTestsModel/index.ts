import { TestType } from "./types";
import { organizationsConfig, userInOrganizationsConfig } from './testConfig'
import { Id } from "../../../utils/identifier";

export function isTestEnabledForOrganization(organizationId: Id, testType: TestType): boolean {
  const testOrganizations = organizationsConfig[testType] || []
  return testOrganizations.includes(organizationId)
}

export function isTestEnabledForUserInOrganization(userInOrganizationId: Id, testType: TestType): boolean {
  const testOrganizations = userInOrganizationsConfig[testType] || []
  return testOrganizations.includes(userInOrganizationId)
}

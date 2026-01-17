import { CreateWorkspaceResult, OrganizationJson } from "../types";
import { Id } from "../../common/identifier";


export interface WorkspaceServiceInterface {

  /**
   * Create workspace
   *
   * @param {Id} userId
   * @param {string} email
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @return {Promise<CreateWorkspaceResult>}
   */
  createWorkspace(
    userId: Id,
    organizationId: Id,
    organizationJson: OrganizationJson,
    userLanguage: string,
  ): Promise<CreateWorkspaceResult>

  doCreateWorkspace(
    trx: Transaction,
    userId: Id,
    organizationId: Id,
    organizationJson: OrganizationJson,
    userLanguage: string,
  ): Promise<CreateWorkspaceResult>

}

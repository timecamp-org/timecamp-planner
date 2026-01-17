import { Id } from "../../common/identifier";
import { ExtensionDbRow, ExtensionInOrganizationDbRow } from "../../db/schema";
import { EntityStatus } from "../../common/enum";

export interface WorkspaceExtensionProviderInterface {
  getExtensionInWorkspace(extensionId: Id, organizationId: Id): PromiseLike<ExtensionInOrganizationDbRow>;

  getWorkspaceExtensions(organizationId: Id, extensions: ExtensionDbRow[]): PromiseLike<ExtensionInOrganizationDbRow[]>;

  updateExtensionStatusInWorkspace(extensionId: Id, organizationId: Id, status: EntityStatus): PromiseLike<void>;
}
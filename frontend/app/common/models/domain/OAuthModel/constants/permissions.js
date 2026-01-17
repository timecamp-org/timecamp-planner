import * as Scope from './scopes';
import { i18mark } from '../../../../i18n';

const permissionDescriptions = {
  [Scope.HEYSPACE_PROFILE]: i18mark('Access your name and email address.'),
  [Scope.HEYSPACE_WORKSPACE_MANAGEMENT]: i18mark('Access your workspaces, projects and lists.'),
  [Scope.HEYSPACE_CREATE_CARDS]: i18mark('Create tasks on your behalf.'),
};

export default {
  [Scope.HEYSPACE]: [
    permissionDescriptions[Scope.HEYSPACE_PROFILE],
    permissionDescriptions[Scope.HEYSPACE_WORKSPACE_MANAGEMENT],
    permissionDescriptions[Scope.HEYSPACE_CREATE_CARDS],
  ],
};

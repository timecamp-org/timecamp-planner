import { AppUserRole } from "common/models/domain/UserAppsModel/types";
import { i18mark } from "common/i18n";

export const localizedRoles = {
  [AppUserRole.COLLABORATOR]: i18mark('collaborator'),
  [AppUserRole.OWNER]: i18mark('owner'),
}

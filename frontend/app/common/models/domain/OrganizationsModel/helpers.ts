import { OrganizationPeopleRole } from './types';


export function isUserConvertedToOrFromGuest(currentUserRole: OrganizationPeopleRole, newRole: OrganizationPeopleRole): boolean {
  if (!currentUserRole || !newRole) {
    return false
  }

  const isConvertedFromGuest = currentUserRole === OrganizationPeopleRole.GUEST && newRole !== OrganizationPeopleRole.GUEST
  const isConvertedToGuest = currentUserRole !== OrganizationPeopleRole.GUEST && newRole === OrganizationPeopleRole.GUEST

  return isConvertedFromGuest || isConvertedToGuest
}
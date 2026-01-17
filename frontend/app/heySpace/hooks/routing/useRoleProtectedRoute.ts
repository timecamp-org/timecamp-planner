import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types'
import { useRedirect } from 'hooks/routing/useRedirect'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectCurrentUserOrganizationRole
} from 'models/domain/OrganizationsModel/selectors'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'

export const useAllowedRoleProtectedRoute = (allowedRoles: OrganizationPeopleRole[], fallbackRoute: string): void => {
  const { currentRole } = useCurrentRole()

  useRedirect(
    fallbackRoute,
    () => !allowedRoles.includes(currentRole),
  )
}

export const useForbiddenRoleProtectedRoute = (forbiddenRoles: OrganizationPeopleRole[], fallbackRoute: string): void => {
  const { currentRole } = useCurrentRole()

  useRedirect(
    fallbackRoute,
    () => forbiddenRoles.includes(currentRole),
  )
}

type CurrentRoleHookInterface = {
  currentRole: OrganizationPeopleRole,
}

const useCurrentRole = (): CurrentRoleHookInterface => {
  const organizationId = useSelector(state => selectCurrentOrganizationId(state))
  const currentRole = useSelector(state => selectCurrentUserOrganizationRole(state, { organizationId }))

  return {
    currentRole,
  }
}

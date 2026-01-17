import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentOrganizationName } from 'models/domain/OrganizationsModel/selectors/domain'

export type CurrentWorkspaceInfoHookInterface = {
  currentWorkspaceName: string,
}

export const useComponent = (): CurrentWorkspaceInfoHookInterface => {
  const currentWorkspaceName = useSelector(state => selectCurrentOrganizationName(state))


  return {
    currentWorkspaceName,
  }
}

import { WorkspaceTileInterface } from '.';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectOrganizationName, 
  selectOrganizationLogo,
  selectOrganizationInitials
} from 'models/domain/OrganizationsModel/selectors/domain'
import * as OrganizationModelActions from 'models/domain/OrganizationsModel/actions'
import { useCallback } from 'react';
import { NavigationService } from 'common/services'
import RouteName from 'components/AppNavigation/routeNames'

export type WorkspaceTileHookInterface = {
  organizationName: string,
  organizationLogo: string,
  organizationInitials: string,
  onSwitchOrganization: VoidFunction,
}


export default function useComponent(props: WorkspaceTileInterface): WorkspaceTileHookInterface {
  const organizationName = useSelector(state => selectOrganizationName(state, { organizationId: props.organizationId }))
  const organizationLogo = useSelector(state => selectOrganizationLogo(state, { organizationId: props.organizationId }))
  const organizationInitials = useSelector(state => selectOrganizationInitials(state, { organizationId: props.organizationId }))

  const dispatch = useDispatch()

  const onSwitchOrganization = useCallback(
    () => {
      dispatch(OrganizationModelActions.onSwitchOrganization(props.organizationId))
      NavigationService.reset(RouteName.PROJECT_LOADER)
    },
    [props.organizationId]
  )

  return {
    organizationName,
    organizationLogo,
    organizationInitials,
    onSwitchOrganization,
  }
}
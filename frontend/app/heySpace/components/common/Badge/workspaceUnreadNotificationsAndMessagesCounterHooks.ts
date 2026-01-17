import { DataProviderHookInterface } from './dataHooks'
import { BadgeInterface } from './index'
import { selectWorkspaceUnreadNotificationsAndMessages } from '../../../../common/models/domain/NotificationsModel/selectors'
import { useSelector } from 'react-redux'

export function useDataProvider(props: BadgeInterface): DataProviderHookInterface {
  return {
    counter: useSelector(state => selectWorkspaceUnreadNotificationsAndMessages(state, { organizationId: props.objectId }))
  }
}
import { DataProviderHookInterface } from './dataHooks'
import { BadgeInterface } from './index'
import { selectUnreadNotificationsCount } from '../../../../common/models/domain/NotificationsModel/selectors'
import { useSelector } from 'react-redux'

export function useDataProvider(props: BadgeInterface): DataProviderHookInterface {
  return {
    counter: useSelector(state => selectUnreadNotificationsCount(state, { objectId: props.objectId }))
  }
}
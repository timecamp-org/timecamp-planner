import { selectUserFirstName, selectUserLastName } from 'models/domain/UsersModel/selectors/domain'
import { UserNameInterface } from 'commonComponents/UserName/index'
import { useSelector } from 'common/hooks/useSelector'

type DataProviderHook = {
  firstName: string,
  lastName: string,
}

export function useDataProvider({ userId }: UserNameInterface): DataProviderHook {
  const firstName = useSelector(state => selectUserFirstName(state, { userId }))
  const lastName = useSelector(state => selectUserLastName(state, { userId }))

  return {
    firstName,
    lastName,
  }
}
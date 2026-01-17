import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserEmail } from 'common/models/domain/UsersModel/selectors/domain'
import { onUpdateUser } from 'common/models/domain/UsersModel/actions'
import { UserInterface } from 'common/models/domain/UsersModel/types'

export type DataProviderHook = {
  email: string,
};

export function useDataProvider(): DataProviderHook {
  return {
    email: useSelector(selectCurrentUserEmail),
  }
}

export type DataPersisterHook = {
  onUpdateUser: (fields: Partial<UserInterface>) => void
};

export function useDataPersister(): DataPersisterHook {
  const dispatch = useDispatch()

  return {
    onUpdateUser: useCallback(
      (fields) => dispatch(onUpdateUser(fields, true)),
      [dispatch]
    )
  }
}

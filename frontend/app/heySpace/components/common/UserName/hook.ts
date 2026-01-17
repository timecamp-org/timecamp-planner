import { useDataProvider } from 'commonComponents/UserName/dataHooks'
import { UserNameInterface } from 'commonComponents/UserName/index'

type UserNameHookInterface = {
  firstName: string,
  lastName: string,
}

export const useComponent = (props: UserNameInterface): UserNameHookInterface => {
  const { firstName, lastName } = useDataProvider(props)
  return {
    firstName,
    lastName,
  }
}
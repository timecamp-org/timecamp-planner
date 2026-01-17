import { PersonFullNameInterface } from '.'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectCurrentUserId,
  selectUserFirstName,
  selectUserLastName,
  selectUserEmail,
} from 'models/domain/UsersModel/selectors/domain'
import { selectIsUserActiveInCurrentOrganization } from 'models/domain/OrganizationsModel/selectors/domain'
import { getUserName } from 'common/utils/user'

export type PersonFullNameHookInterface = {
  userName: string,
  shouldDisplayYouInParentheses: boolean,
  isNameSpecified: boolean,
  isUserActive: boolean,
}

export default function useComponent(props: PersonFullNameInterface): PersonFullNameHookInterface {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const firstName = useSelector(state => selectUserFirstName(state, { userId: props.userId }))
  const lastName = useSelector(state => selectUserLastName(state, { userId: props.userId }))
  const email = useSelector(state => selectUserEmail(state, { userId: props.userId }))
  const isUserActive = useSelector(state => selectIsUserActiveInCurrentOrganization(state, { userId: props.userId }))

  const shouldDisplayYouInParentheses = currentUserId === props.userId && props.shouldAddYouInParenthesesIfCurrent
  return {
    userName: getUserName(firstName, lastName, email, props.displayLastNameFirst),
    isNameSpecified: !!(firstName && lastName),
    isUserActive,
    shouldDisplayYouInParentheses
  }
}
import {
  selectUserFirstName,
  selectUserLastName,
  selectUserEmail,
  selectCurrentUserId
} from '../../../../common/models/domain/UsersModel/selectors/domain'
import { selectIsUserActiveInCurrentOrganization } from '../../../../common/models/domain/OrganizationsModel/selectors/domain'
import { PersonFullNameInterface } from "."
import { getUserName } from "common/utils/user"
import { useSelector } from 'common/hooks/useSelector'

export type PersonFullNameHookInterface = {
  isUserActive: boolean,
  shouldDisplayYouInParentheses: boolean
  userFullName: string
}

export function useComponent(props: PersonFullNameInterface): PersonFullNameHookInterface {
  const { userId } = props;
  const firstName = useSelector(state => selectUserFirstName(state, { userId }));
  const lastName = useSelector(state => selectUserLastName(state, { userId }));
  const email = useSelector(state => selectUserEmail(state, { userId }));
  const isUserActive = useSelector(state => selectIsUserActiveInCurrentOrganization(state, { userId }));
  const currentUserId = useSelector(state => selectCurrentUserId(state));
  const userFullName = getUserName(firstName, lastName, email, props.displayLastNameFirst);
  return {
    userFullName,
    isUserActive,
    shouldDisplayYouInParentheses: currentUserId === userId && props.shouldAddYouInParenthesesIfCurrent,
  };
}
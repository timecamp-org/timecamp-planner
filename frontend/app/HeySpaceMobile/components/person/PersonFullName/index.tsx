import React, { FC } from 'react'
import styles from './styles'

import { Text } from 'react-native'
import { Id } from '../../../../common/utils/identifier'
import { AnyDict } from 'common/types'
import useComponent from './hook'

export type PersonFullNameInterface = {
  userId: Id,
  style?: AnyDict,
  numberOfLines?: number,
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
  shouldRenderInvitationPendingStatus?: boolean,
  shouldAddYouInParenthesesIfCurrent?: boolean,
  displayLastNameFirst?: boolean,
}

const defaultProps: Partial<PersonFullNameInterface> = {
  numberOfLines: 1,
  ellipsizeMode: 'tail',
  shouldRenderInvitationPendingStatus: false,
  shouldAddYouInParenthesesIfCurrent: false,
  displayLastNameFirst: false,
}

const PersonFullName: FC<PersonFullNameInterface> = (props) => {
  const hook = useComponent(props)
  if (!hook.isNameSpecified && props.shouldRenderInvitationPendingStatus) {
    return (
      <Text
        style={getStyle(props)}
        numberOfLines={props.numberOfLines}
        ellipsizeMode={props.ellipsizeMode}
      >
        {'(pending invitation)'}
      </Text>
    )
  } else {
    return (
      <Text
        style={getStyle(props)}
        numberOfLines={props.numberOfLines}
        ellipsizeMode={props.ellipsizeMode}
      >
        {`${hook.userName}${hook.shouldDisplayYouInParentheses ? ` (You)` : ''}`}
      </Text>
    )
  }
}

function getStyle(props) {
  return props.isUserActive ? props.style : { ...props.style, ...styles.deactivated }
}

PersonFullName.defaultProps = defaultProps

export default PersonFullName
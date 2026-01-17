import React, { KeyboardEventHandler, MouseEventHandler } from 'react'
import { doNothing } from 'common/utils'

import UserInput from 'commonComponents/UserInput'
import { i18n, i18mark } from 'common/i18n'
import { useComponent } from './hook'

export type UserEmailInputInterface = {
  className?: string,
  innerClassName?: string,
  required?: boolean,
  label?: string,
  autoFocus?: boolean
  maxLength?: number
  placeholder: string,
  disabled: boolean,
  onFocus: MouseEventHandler
  onBlur: MouseEventHandler
  onKeyDown: KeyboardEventHandler
  onKeyUp: KeyboardEventHandler
}

const UserEmailInput: React.FC<UserEmailInputInterface> = (props: UserEmailInputInterface) => {
  const {
    email,
    emailHumanMessageModel,
    onBlur,
    onFocus,
    onUpdate
  } = useComponent(props)

  return (
    <UserInput
      className={props.className}
      innerClassName={props.innerClassName}
      type="text"
      name="email"
      value={email}
      isDisabled={props.disabled}
      required={props.required}
      label={props.label}
      placeholder={i18n.t(props.placeholder)}
      humanMessage={emailHumanMessageModel}
      autoFocus={props.autoFocus}
      onChange={onUpdate}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

UserEmailInput.defaultProps = {
  placeholder: i18mark('Add email...'),
  disabled: false,
  required: true,
  autoFocus: false,

  onFocus: doNothing,
  onBlur: doNothing,
  onKeyDown: doNothing,
  onKeyUp: doNothing,
}


export default UserEmailInput

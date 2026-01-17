import {
  MouseEventHandler,
  MouseEvent,
  useState,
  ChangeEvent,
  ChangeEventHandler
} from 'react'
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind, HumanMessageRecordInterface } from 'models/domain/HumanMessageModel/types';
import { isValidEmail, ValidationResult } from 'common/utils/validation'
import { useDataProvider, useDataPersister } from './dataHooks'
import { UserEmailInputInterface } from '.';

export type UserEmailInputHookInterface = {
  email: string
  emailHumanMessageModel: HumanMessageRecordInterface
  onUpdate: ChangeEventHandler,
  onFocus: MouseEventHandler
  onBlur: MouseEventHandler
}

export function useComponent(props: UserEmailInputInterface): UserEmailInputHookInterface {
  const {
    email
  } = useDataProvider()

  const {
    onUpdateUser
  } = useDataPersister()

  const [localEmail, onSetLocalEmail] = useState(email)
  const [emailHumanMessageModel, onSetEmailHumanMessageModel] = useState<HumanMessageRecordInterface>(null)

  const onEmailUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value

    if (!newEmail) {
      onSetEmailHumanMessageModel(null)
    }

    onSetLocalEmail(newEmail)
  }

  const onEmailInvalid = (text: string) => {
    onSetEmailHumanMessageModel(HumanMessage({
      text,
      kind: HumanMessageKind.error
    }))
  }

  const onFocus = (event: MouseEvent) => {
    const text = (event.target as HTMLInputElement).value
    onSetLocalEmail(text)
    props.onFocus(event)
  }

  const onBlur = (event: MouseEvent) => {
    const text = (event.target as HTMLInputElement).value
    const validationEmailResult: ValidationResult = isValidEmail(text, true) as ValidationResult

    onSetEmailHumanMessageModel(null)

    if (!validationEmailResult.isValid) {
      onEmailInvalid(validationEmailResult.message)
      return
    }

    props.onBlur(event)
    onUpdateUser({ email: text })
    onSetLocalEmail(null)
  }

  return {
    email: localEmail,
    emailHumanMessageModel,
    onUpdate: onEmailUpdate,
    onFocus,
    onBlur
  }
}

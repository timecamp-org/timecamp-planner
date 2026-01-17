import { action } from 'typesafe-actions'
import * as C from './constants'
import { Id } from '../../../utils/identifier'
import { UserProjectSettingsInterface } from './types'

export const onUpdateUserProjectSettings = (projectId: Id, userProjectSettings: Partial<UserProjectSettingsInterface>) =>
  action(C.onUpdateUserProjectSettings, { projectId, userProjectSettings })

export const onFetchUserProjectSettings = (projectId: Id) =>
  action(C.onFetchUserProjectSettings, { projectId })

export const onFetchUserProjectSettingsSuccess = (projectId: Id, userProjectSettings: UserProjectSettingsInterface) =>
  action(C.onFetchUserProjectSettingsSuccess, { projectId, userProjectSettings })

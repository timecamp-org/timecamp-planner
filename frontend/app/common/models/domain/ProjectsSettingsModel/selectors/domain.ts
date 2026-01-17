import { createSelector } from 'reselect'
import { domain } from '../constants'
import { ProjectsSettingsState, UserProjectsSettingsData } from "../types"

export const selectProjectsSettingsDomain = state => state.get(domain) as ProjectsSettingsState

export const selectUserProjectSettingsData = createSelector(
  selectProjectsSettingsDomain,
  domain => domain.get('userProjectsSettingsData') as UserProjectsSettingsData
)

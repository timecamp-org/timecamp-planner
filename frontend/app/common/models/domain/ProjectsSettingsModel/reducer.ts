import { Reducer } from 'redux'
import { fromJS } from 'immutable'
import * as C from './constants'
import { ProjectsSettingsState } from './types'
import { PayloadAction } from '../../../types'
import { UserProjectSettings } from './models'

const initialState: ProjectsSettingsState = fromJS({
  userProjectsSettingsData: {},
})

const projectsSettingsReducer: Reducer<ProjectsSettingsState, PayloadAction> = (state: ProjectsSettingsState = initialState, action: PayloadAction): ProjectsSettingsState => {
  switch (action.type) {
    case (C.onUpdateUserProjectSettings): {
      const { projectId, userProjectSettings } = action.payload
      let userProjectSettingsRecord = state.getIn(['userProjectsSettingsData', projectId])

      if (!userProjectSettingsRecord) {
        userProjectSettingsRecord = new UserProjectSettings(userProjectSettings)
      } else {
        Object.keys(userProjectSettings).forEach(key => {
          const value = userProjectSettings[key]
          userProjectSettingsRecord = userProjectSettingsRecord.set(key, value)
        })
      }

      return state
        .setIn(['userProjectsSettingsData', projectId], userProjectSettingsRecord)
    }

    case C.onFetchUserProjectSettingsSuccess: {
      const { projectId, userProjectSettings } = action.payload
      return state
        .setIn(['userProjectsSettingsData', projectId], userProjectSettings)
    }

    default: {
      return state
    }
  }
}

export default projectsSettingsReducer

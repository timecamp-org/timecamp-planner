import createCachedSelector from 're-reselect'
import {selectUserProjectSettingsData} from './domain'
import {UserProjectSettingsInterface} from "../types"
import generateSelectorName from "../../../../utils/generateSelectorName";

/**
 * @param {string} projectId
 * @returns {UserProjectSettingsInterface}
 */
export const selectUserProjectSettings = createCachedSelector(
  selectUserProjectSettingsData,
  (_, args) => args.projectId,
  (userProjectsSettingsData, projectId) => userProjectsSettingsData.get(projectId) as UserProjectSettingsInterface,
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )

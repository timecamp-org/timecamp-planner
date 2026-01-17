import { UserProjectSettings } from './models'
import { UserProjectSettingsInterface, UserProjectSettingsDbRow } from './types';

export function normalizeUserProjectSettingsDataFromAPI(userProjectSettingsData: UserProjectSettingsDbRow): UserProjectSettingsInterface {
  const { userId, projectId, ...userProjectSettings } = userProjectSettingsData
  return new UserProjectSettings(userProjectSettings)
}

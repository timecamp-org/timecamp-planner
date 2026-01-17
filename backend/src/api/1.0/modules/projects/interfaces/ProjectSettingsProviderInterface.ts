import { Id } from '../../common/identifier'
import {
  ProjectSettingsJson, SetUserProjectSettingsResult,
} from '../types'
import { ProjectSettingsDbRow } from '../../db/schema'


export interface ProjectSettingsProviderInterface {
  getUserProjectSettings(userId: Id, projectId: Id, trx?: Transaction): Promise<ProjectSettingsDbRow>
  setUserProjectSettings(userId: Id, projectId: Id, projectSettingsJson: ProjectSettingsJson): Promise<SetUserProjectSettingsResult>
}

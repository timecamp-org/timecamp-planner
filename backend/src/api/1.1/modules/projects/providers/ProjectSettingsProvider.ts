import { injectable, inject } from 'inversify'
import { ProjectSettingsProviderInterface } from '../interfaces/ProjectSettingsProviderInterface'
import { Id } from '../../common/identifier'

import { ProjectSettingsDbRow } from '../../db/schema'

import Table, { ForeignKey } from '../../db/Table'
import {
  ProjectSettingsJson,
  SetUserProjectSettingsResult,
  SetUserProjectSettingsStatus,
} from '../types'
import { violatesForeignKey } from '../../../../../utils'
import { DbModule } from '../../db/DbModule'
import { ConnectionInterface } from '../../db/ConnectionInterface'

@injectable()
export class ProjectSettingsProvider implements ProjectSettingsProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
  }

  async getUserProjectSettings(userId: Id, projectId: Id, trx?: Transaction): Promise<ProjectSettingsDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select('*')
      .from(Table.PROJECT_SETTINGS)
      .where({
        userId,
        projectId,
      })
      .first()
  }

  async setUserProjectSettings(userId: Id, projectId: Id, projectSettingsJson: ProjectSettingsJson): Promise<SetUserProjectSettingsResult> {
    try {
      const connection = this.connection.getConnection()
      await connection.transaction(async trx => {
        const old = await this.getUserProjectSettings(userId, projectId, trx)

        if (old) {
          await connection
            .from(Table.PROJECT_SETTINGS)
            .transacting(trx)
            .update(projectSettingsJson)
            .where({ userId, projectId })
        } else {
          await connection
            .into(Table.PROJECT_SETTINGS)
            .insert({
              userId,
              projectId,
              ...projectSettingsJson,
            })
        }
      })
      return { status: SetUserProjectSettingsStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.PROJECT_SETTINGS_PROJECT_ID_FK)) {
        return { status: SetUserProjectSettingsStatus.PROJECT_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.PROJECT_SETTINGS_USER_ID_FK)) {
        return { status: SetUserProjectSettingsStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

}
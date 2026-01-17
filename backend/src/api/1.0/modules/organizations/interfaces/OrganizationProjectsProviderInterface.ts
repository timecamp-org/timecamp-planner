import { Id } from '../../common/identifier'
import { Maybe } from '../../common/types'
import { QueryModifier } from '../../../../../services/types'

import { ProjectDbRow } from '../../db/schema'

export interface OrganizationProjectsProviderInterface {
  getOrganizationUserProjects(
    organizationId: Id,
    userId: Id,
    queryDecorators?: Maybe<QueryModifier[]>,
    columnNames?: string[],
    trx?: Transaction,
  ): PromiseLike<Array<ProjectDbRow>>
}

import Table from '../db/Table'
import { get } from 'lodash'
import { ProjectTasksQueryParams } from './types'
import { EntityStatus } from '../common/enum'
import { Id } from '../common/identifier'

export const getTasksQueryDecorator =
  (queryParams: ProjectTasksQueryParams) =>
    (decoratedQuery: QueryInterface): QueryBuilder => {
      const fetchArchived = get(queryParams, 'fetchArchived', false)
      const organizationId = get(queryParams, 'organizationId', false)

      return decoratedQuery
        .join(Table.TASK_LIST, `${Table.TASK_LIST}.id`, `${Table.TASK}.taskListId`)
        .join(Table.PROJECT, `${Table.PROJECT}.id`, `${Table.TASK}.projectId`)
        .andWhere(function() {
          if (fetchArchived) {
            this.where(`${Table.TASK}.isArchived`, true)
            this.orWhere(`${Table.TASK_LIST}.isArchived`, true)
            this.orWhere(`${Table.PROJECT}.status`, EntityStatus.ARCHIVED)
          } else {
            this.where(`${Table.TASK}.isArchived`, false)
            this.andWhere(`${Table.TASK_LIST}.isArchived`, false)
            this.andWhere(`${Table.PROJECT}.status`, EntityStatus.EXISTS)
          }

          if (organizationId) {
            this.andWhere(`${Table.PROJECT}.organizationId`, organizationId)
          }
        })
    }

export const getTasksAssignedToUserQueryDecorator =
  (userId: Id) =>
    (decoratedQuery: QueryInterface): QueryBuilder => {
      return decoratedQuery
        .join(Table.USER_IN_TASK, `${Table.TASK}.id`, `${Table.USER_IN_TASK}.taskId`)
        .where({
          [`${Table.USER_IN_TASK}.userId`]: userId,
        })
    }
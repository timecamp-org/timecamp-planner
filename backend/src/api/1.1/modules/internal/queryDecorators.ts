import Table from '../db/Table'

import { get } from 'lodash'
import { QueryModifier } from '../../../../services/types';
import { ProjectTasksQueryParams } from '../tasks/types';

export const getListsQueryDecorator =
  (queryParams: ProjectTasksQueryParams) => {
    return (decoratedQuery: QueryInterface): QueryBuilder => {
      const fetchArchived = get(queryParams, 'fetchArchived', false)

      return decoratedQuery
        .leftJoin(Table.TASK, `${Table.TASK}.taskListId`, '=', `${Table.TASK_LIST}.id`)
        .andWhere(function() {
          if (fetchArchived) {
            this.where(`${Table.TASK_LIST}.isArchived`, '=', true)
            this.orWhere(`${Table.TASK}.isArchived`, '=', true)
          } else {
            this.where(`${Table.TASK_LIST}.isArchived`, '=', false)
          }
        })
        .groupBy(`${Table.TASK_LIST}.id`)
    }
  }

export const getProjectTasksBasicDataQueryDecorator =
  (queryParams: ProjectTasksQueryParams) =>
    (decoratedQuery: QueryInterface): QueryBuilder => {
      const fetchArchived = get(queryParams, 'fetchArchived', false)

      return decoratedQuery
        .join(`${Table.TASK_LIST}`, `${Table.TASK_LIST}.id`, '=', `${Table.TASK}.taskListId`)
        .andWhere(function() {
          if (fetchArchived) {
            this.where(`${Table.TASK}.isArchived`, '=', true)
            this.orWhere(`${Table.TASK_LIST}.isArchived`, '=', true)
          } else {
            this.where(`${Table.TASK}.isArchived`, '=', false)
            this.andWhere(`${Table.TASK_LIST}.isArchived`, '=', false)
          }
        })
    }

export const conversationSettingsQueryModifier: QueryModifier = q => q.select(['isVisible', 'conversationHash'])

export const checklistDataQueryModifier: QueryModifier = q => q.select(['id', 'isChecked', 'name', 'order', 'taskId'])

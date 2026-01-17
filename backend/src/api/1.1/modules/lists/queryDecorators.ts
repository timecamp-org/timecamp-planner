import { QueryModifier } from '../../../../services/types';
import Table from '../db/Table'

export const unarchivedListModifier: QueryModifier = q => 
  q.where(`${Table.TASK_LIST}.isArchived`, false)

export const unarchivedListAndTasksModifier: QueryModifier = q => 
  q.where({
    [`${Table.TASK_LIST}.isArchived`]: false,
    [`${Table.TASK}.isArchived`]: false,
  })

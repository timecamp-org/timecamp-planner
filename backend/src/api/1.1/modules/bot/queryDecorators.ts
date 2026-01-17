import { QueryModifier } from '../../../../services/types';

export const autojoinableProjectsModifier: QueryModifier = q => 
  q.where('autoJoin', true)

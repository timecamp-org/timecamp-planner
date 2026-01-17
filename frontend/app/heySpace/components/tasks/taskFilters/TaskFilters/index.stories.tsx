import React from 'react';
import TaskFilters from './index'
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';

export default {
  title: 'tasks/TaskFilters',
};

export const projectFilters = () =>
  <TaskFilters
    containerType={TaskFiltersContainerType.PROJECT}
    targetType={TaskFiltersTargetType.KANBAN}
    containerId={'project::001'}
  />;

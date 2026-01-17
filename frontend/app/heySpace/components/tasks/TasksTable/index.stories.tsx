import React from 'react';
import TasksTable from './index'
import { List } from 'immutable';

export default {
  title: 'tasks/TasksTable',
};

export const table = () =>
  <div style={{ height: 800 }}>
    <TasksTable
      taskIds={List([
        'task::001',
        'task::002',
        'task::003',
      ])}
      filterId={'project::001'}
    />;
</div>

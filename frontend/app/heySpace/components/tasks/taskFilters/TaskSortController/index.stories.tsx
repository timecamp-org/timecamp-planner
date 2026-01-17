import TaskSortController from './index';

export default {
  title: 'tasks/TaskSortController',
};

export const controller = () => <TaskSortController disableSort filterId={'filter:001'} sortKey={'name'} />;

import { ProjectTemplateInterface } from 'components/menu/AddSpaceControllerNext/types';
import { pick } from 'lodash';
import { selectListData, selectProjectListIdsInOrder } from 'models/domain/ListsModel/selectors';
import { selectTaskIdsByListId } from 'models/domain/ListsModel/selectors/domain';
import { TaskListInterface } from 'models/domain/ListsModel/types';
import { selectTask } from 'models/domain/TasksModel/selectors';
import { createSelector } from 'reselect';
import { selectProject } from '.';
import { selectChecklistItemsDataByTaskId } from '../../ChecklistsModel/selectors/domain';

export const selectTemplateDataFromProject = createSelector(
  selectProject,
  selectProjectListIdsInOrder,
  (state) => state,
  (_, args) => args.includeTasks,
  (projectData, listIds, state, includeTasks): Omit<ProjectTemplateInterface, 'id'> => {
    const listData: TaskListInterface[] = listIds.map((listId) => selectListData(state, { listId })).toJS();

    const listsWithTasks = listData.map((list) => {
      return {
        ...pick(list, ['order', 'name']),
        taskTemplates: includeTasks
          ? selectTaskIdsByListId(state, { listId: list.id })
              ?.map((taskId, index) => {
                const task = {
                  ...pick(selectTask(state, { taskId })?.toJS(), [
                    'id',
                    'name',
                    'description',
                    'startDate',
                    'dueDate',
                    'taskPriorityType',
                    'order',
                  ]),
                  checklistItemTemplates: selectChecklistItemsDataByTaskId(state, { taskId })
                    ?.toArray()
                    ?.map(({ name, order, isChecked }) => ({ name, order: order === 0 ? 1 : order, isChecked })),
                };

                if (!task.order) {
                  task.order = ++index;
                }

                return task;
              })
              ?.toJS()
          : [],
      };
    });

    return {
      ...pick(projectData?.toJS(), ['name', 'organizationId', 'description', 'color']),
      taskListTemplates: listsWithTasks,
    };
  },
);

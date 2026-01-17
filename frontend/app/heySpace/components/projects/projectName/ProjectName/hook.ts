import { useSelector } from 'common/hooks/useSelector';
import { EntityStatus } from 'models/domain/EntityModel/types';
import { selectProjectColor, selectProjectName, selectProjectStatus } from 'models/domain/ProjectsModel/selectors';
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors';

import { ProjectNameInterface } from '.';

export type ProjectNameHookInterface = {
  color: string;
  projectName: string;
  isArchived: boolean;
};

export default function useComponent(props: ProjectNameInterface): ProjectNameHookInterface {
  const taskProjectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId: props.taskId }));
  const projectId = props.projectId || taskProjectId;
  const projectName = useSelector((state) => selectProjectName(state, { projectId }));
  const color = useSelector((state) => selectProjectColor(state, { projectId }));
  const isArchived = useSelector((state) => selectProjectStatus(state, { projectId })) !== EntityStatus.EXISTS;

  return {
    projectName,
    color,
    isArchived,
  };
}

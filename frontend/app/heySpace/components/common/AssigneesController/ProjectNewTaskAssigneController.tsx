import { FC, useEffect } from 'react';

import { List } from 'immutable';

import { Id } from 'common/utils/identifier';
import { useTranslation } from 'i18n';

import { AssigneesControllerInterface, AssigneesControllerView, defaultProps } from './AssignieControllerView';
import { useComponent } from './hooks/hook';
import { useProjectNewTaskData } from './hooks/projectNewTaskDataHooks';

interface ProjectNewTaskAssigneesControllerInterface extends Omit<AssigneesControllerInterface, 'hook'> {
  projectId: Id;
  onAssigneesChange: (assignees: List<string>) => void;
  initialAssignees?: List<Id>;
  isAssigneesPickerOpen: boolean;
  onSetIsPickerOpen: (isPickerOpen: boolean) => void;
}

const ProjectNewTaskAssigneesController: FC<ProjectNewTaskAssigneesControllerInterface> = (props) => {
  const { projectId, onAssigneesChange, initialAssignees } = props;
  const { dataPersister, dataProvider } = useProjectNewTaskData({ projectId, initialAssignees });
  const { t } = useTranslation();

  const hook = useComponent({
    ...props,
    dataPersister,
    dataProvider,
  });

  useEffect(() => {
    onAssigneesChange(dataProvider.assigneeIds);
  }, [dataProvider.assigneeIds, onAssigneesChange]);

  return (
    <AssigneesControllerView
      {...props}
      hook={hook}
      targetTitleLabel={t('Assign people')}
      poperTitleLabel={t('Assign user to a task')}
      poperInputPlaceholder={t('Search person, project or task')}
    />
  );
};

ProjectNewTaskAssigneesController.defaultProps = defaultProps;

export { ProjectNewTaskAssigneesController };

import { FC, useState } from 'react';

import { Button } from '@mui/material';

import { useSelector } from 'common/hooks/useSelector';
import { useTranslation } from 'common/i18n';
import { ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';
import DueDate from 'commonComponents/DueDate';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import ProjectName from 'components/projects/projectName/ProjectName';
import ProjectNameIO from 'components/projects/projectName/ProjectNameIO';
import TaskNameOutput from 'components/tasks/taskName/TaskNameOutput';
import { EntityType } from 'models/domain/EntityModel/types';
import { selectProjectName } from 'models/domain/ProjectsModel/selectors';
import { selectProjectIdByTaskId, selectTaskName } from 'models/domain/TasksModel/selectors';

import { ChatPreview } from '../ChatPreview/ChatPreview';

import { ItemLayout } from './ItemLayout';

export interface ChatItemInterface {
  containerId: Id;
  id: Id;
  senderId: Id;
  content: string;
  createdAt: number;
  containerType: EntityType;
}

const TaskChatPath: FC<{ taskId: Id }> = ({ taskId }) => {
  const taskName = useSelector((state) => selectTaskName(state, { taskId }));
  const projectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId }));
  const projectName = useSelector((state) => selectProjectName(state, { projectId }));

  return (
    <>
      <ProjectName taskId={taskId} /> {projectName && <>&gt;</>}
      <TooltipedHoveredComponent message={taskName}>{ellipsizeInTheEnd(taskName, 20)}</TooltipedHoveredComponent>
    </>
  );
};

const useContainerPath = (containerType: EntityType, containerId: Id) => {
  const taskName = useSelector((state) => selectTaskName(state, { taskId: containerId }));
  const projectName = useSelector((state) => selectProjectName(state, { projectId: containerId }));

  switch (containerType) {
    case EntityType.PROJECT_DATA:
      return (
        <>
          <ProjectNameIO projectId={containerId} maxLength={10} />
          {projectName && <>&gt;</>}
        </>
      );

    case EntityType.TASK_DATA:
      return (
        <>
          <TaskChatPath taskId={containerId} />
          {taskName && <>&gt;</>}
        </>
      );

    case EntityType.TAG_DATA:
      return <TaskNameOutput taskId={containerId} />;

    default:
      return null;
  }
};

export const ChatItem: FC<ChatItemInterface> = ({ containerId, content, createdAt, id, senderId, containerType }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenPreview = () => setIsOpen(true);
  const onClosePreview = () => setIsOpen(false);

  const path = useContainerPath(containerType, containerId);

  return (
    <>
      <ItemLayout
        img={<PersonIcon userId={senderId} />}
        title={content}
        subtitle={
          <>
            {path}
            <PersonFullName userId={senderId} />
            •
            <DueDate dueDate={createdAt} />
          </>
        }
        actionButtons={<Button onClick={onOpenPreview}>{t('Open')}</Button>}
      />

      {isOpen && <ChatPreview messageId={id} onClosePreview={onClosePreview} />}
    </>
  );
};

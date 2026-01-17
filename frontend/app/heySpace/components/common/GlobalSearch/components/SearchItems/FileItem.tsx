import { FC } from 'react';

import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';
import { useSelector } from 'react-redux/es/exports';

import { useTranslation } from 'common/i18n';
import { Id } from 'common/utils/identifier';
import { downloadFiles } from 'common/utils/saveFile';
import DueDate from 'commonComponents/DueDate';
import { ArrowDownToLine } from 'commonComponents/Icons/fontawesome/ArrowDowToLine';
import { File } from 'commonComponents/Icons/fontawesome/File';
import PersonFullName from 'components/person/PersonFullName';
import { EntityStatus } from 'models/domain/EntityModel/types';
import { isImage } from 'models/domain/FilesModel/helpers';
import { selectProjectName } from 'models/domain/ProjectsModel/selectors';
import { selectProjectIdByTaskId, selectTaskName } from 'models/domain/TasksModel/selectors';

import { ActionButton } from '../styled';

import { ItemLayout } from './ItemLayout';

export interface FileItemInterface {
  id: Id;
  userId: Id;
  taskId?: Id;
  name: string;
  status: EntityStatus;
  url: string;
  contentType: string;
  createdAt: number;
}

const StyledImage = styled.img`
  width: 2.4rem;
  height: 2.4rem;
`;

const FORMAT = 'DD/MM/YYYY';

const TaskFileLocation = ({ taskId }: { taskId: Id }) => {
  const projectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId }));
  const projectName = useSelector((state) => selectProjectName(state, { projectId }));
  const taskName = useSelector((state) => selectTaskName(state, { taskId }));

  return (
    <span>
      {projectName} &gt; {taskName}
    </span>
  );
};

export const FileItem: FC<FileItemInterface> = ({ contentType, id, name, status, url, userId, createdAt, taskId }) => {
  const { t } = useTranslation();

  const onDownloadClick = () => downloadFiles([{ url, name }]);

  return (
    <ItemLayout
      isArchived={status === EntityStatus.ARCHIVED}
      img={<>{isImage(contentType) ? <StyledImage src={url} /> : <File height={30} width={30} />}</>}
      title={name}
      subtitle={
        <>
          {taskId && (
            <>
              <TaskFileLocation taskId={taskId} /> •
            </>
          )}
          <PersonFullName userId={userId} />
          •
          <DueDate dueDate={createdAt} format={FORMAT} />
        </>
      }
      actionButtons={
        <>
          <ButtonBase onClick={onDownloadClick}>
            <ArrowDownToLine />
          </ButtonBase>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ActionButton>{t('View')}</ActionButton>
          </a>
        </>
      }
    />
  );
};

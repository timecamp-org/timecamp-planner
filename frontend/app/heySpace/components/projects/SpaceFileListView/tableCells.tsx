import { ReactNode, useState } from 'react';

import styled from '@emotion/styled';
import { Button, Checkbox, IconButton, SxProps } from '@mui/material';
import { useParams } from 'react-router';

import { useSelector } from 'common/hooks/useSelector';
import { selectTaskName } from 'common/models/domain/TasksModel/selectors';
import { SortOrder } from 'common/types';
import { ellipsizeInTheEnd } from 'common/utils';
import { getFormattedDateForFilesTable } from 'common/utils/dateOperations';
import { Id } from 'common/utils/identifier';
import { downloadFiles } from 'common/utils/saveFile';
import { File } from 'commonComponents/Icons';
import { ArrowDownToLine } from 'commonComponents/Icons/fontawesome/ArrowDowToLine';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import { useTranslation } from 'i18n';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { isImage } from 'models/domain/FilesModel/helpers';
import { selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors';
import { ObjectResourceType } from 'models/domain/ProjectsModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { useDispatch } from 'react-redux';

import { DeleteFileModal } from './DeleteFileModal';
import { convertFilteredData } from './helpers';
import styles from './styles.css';
import { SortLabel } from './TableLabel/sortLabel';
import {
  FileData,
  FileTableCellInterface,
  HeaderCellInterface,
  SelectCellInterface,
  SelectedFileData,
  SetSelectedFiles,
} from './types';

const AVATAR_SIZE = 24;
const MAX_NAME_LENGTH = 18;
const checkboxStyles: SxProps = {
  transform: 'scale(1.5)',
  color: 'var(--color-gray-200)',
};

export const renderSelectHeader = ({ selectableFiles, setSelectedFiles, allIdsSelected }) => (
  <Checkbox
    sx={checkboxStyles}
    size="medium"
    checked={allIdsSelected}
    onChange={(x, y) => {
      // eslint-disable-next-line no-unused-expressions
      y ? setSelectedFiles(selectableFiles) : setSelectedFiles([]);
    }}
  />
);

export const getRenderSelectCell =
  ({ setSelectedFiles, selectedFiles }: { setSelectedFiles: SetSelectedFiles; selectedFiles: SelectedFileData[] }) =>
  ({ rowData, ...props }: FileTableCellInterface) =>
    renderSelectCell({ setSelectedFiles, selectedFiles, rowData, ...props });

export const renderSelectCell = ({ rowData, setSelectedFiles, selectedFiles }: SelectCellInterface) => (
  <Checkbox
    sx={checkboxStyles}
    size="medium"
    checked={selectedFiles.some(({ id }) => id === rowData.id)}
    onChange={(x, y) => {
      setSelectedFiles((files) =>
        files.some(({ id }) => id === rowData.id)
          ? files.filter(({ id }) => id !== rowData.id)
          : [...files, convertFilteredData(rowData)],
      );
    }}
  />
);

export const renderFileNameCell = ({ rowData: { name, contentType, id, url } }: FileTableCellInterface) => (
  <div className={styles.nameCell}>
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.nameLink}>
      {isImage(contentType) ? <Image url={url} /> : renderFile(url)}
      <TooltipedHoveredComponent message={name} className={styles.ellipsized}>
        <span className={styles.fileName}>{ellipsizeInTheEnd(name, MAX_NAME_LENGTH)}</span>
      </TooltipedHoveredComponent>
    </a>
  </div>
);
export const renderUploadedByCell = ({ rowData: { userId } }: FileTableCellInterface) => (
  <div className={styles.uploadedByCell}>
    <PersonIcon userId={userId} className={styles.userIcon} width={AVATAR_SIZE} height={AVATAR_SIZE} />
    <PersonFullName userId={userId} />
  </div>
);

export const renderDateCell = ({ rowData: { createdAt } }: FileTableCellInterface) => (
  <div> {getFormattedDateForFilesTable(createdAt)} </div>
);

export const renderLocationCell = ({ rowData }: FileTableCellInterface) => <Location {...rowData} />;

const StyledButton = styled(Button)<{ isTask: boolean }>`
  ${({ isTask }) => !isTask && 'color: var(--color-gray-900); font-weight: var(--fontWeight-regular);'}
`;

const Location = ({ taskId, projectId }: { taskId: Id; projectId?: Id }) => {
  const { t } = useTranslation();
  const name = useSelector((props) => selectTaskName(props, { taskId }));
  const dispatch = useDispatch();
  const onClick = taskId ? () => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)) : null;

  const label = taskId ? name : projectId ? t('Project') : t('chat');

  return (
    <StyledButton onClick={onClick} variant="text" isTask={!!taskId}>
      {ellipsizeInTheEnd(label, MAX_NAME_LENGTH)}
    </StyledButton>
  );
};

export const renderActionsCell = (props: FileTableCellInterface) => {
  const {
    rowData: { url, name },
  } = props;

  return (
    <div className={styles.actionsCell}>
      <IconButton
        className={styles.actionIcon}
        onClick={() => {
          downloadFiles([{ url, name }]);
        }}
      >
        <ArrowDownToLine />
      </IconButton>

      <DeleteAction {...props} />
    </div>
  );
};

const DeleteAction = ({ rowData: { id, userId } }: FileTableCellInterface) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { objectType, projectId: objectId } = useParams<{ projectId: string; objectType: ObjectResourceType }>();

  const isConversation = objectType === ObjectResourceType.CONVERSATIONS;
  const projectId = useSelector((state) =>
    isConversation ? selectProjectIdByConversationId(state, { conversationId: objectId }) : objectId,
  );
  const currentUserId = useSelector(selectCurrentUserId);
  const isCurrentUserFile = userId === currentUserId;

  if (!isCurrentUserFile) {
    return null;
  }

  return (
    <>
      <IconButton onClick={() => setIsModalOpen(true)} className={styles.actionIcon}>
        <TrashCan />
      </IconButton>
      {isModalOpen && (
        <DeleteFileModal
          fileIds={[id]}
          projectId={projectId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

function renderLabel(label: ReactNode) {
  return (
    <span className={styles.label} key="label" title={typeof label === 'string' ? label : null}>
      {label}
    </span>
  );
}

export const getHeaderRenderer =
  (sort: (sortBy: keyof FileData, order: SortOrder) => void, order: SortOrder | null, sortKey: keyof FileData) =>
  ({ label, disableSort, dataKey }: HeaderCellInterface) => {
    if (disableSort) {
      return renderLabel(label);
    }

    const onToggleSortOrder = (newOrder: SortOrder) => sort(dataKey as keyof FileData, newOrder);
    const labelOrder = sortKey === dataKey ? order : null;

    return (
      <SortLabel order={labelOrder} targetRenderer={() => renderLabel(label)} onToggleSortOrder={onToggleSortOrder} />
    );
  };

const Image = ({ url }: { url: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return <img src={url} className={`${styles.image} ${isLoaded && styles.loaded}`} onLoad={() => setIsLoaded(true)} />;
};

function renderFile(url) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <File height={30} width={30} />
    </a>
  );
}

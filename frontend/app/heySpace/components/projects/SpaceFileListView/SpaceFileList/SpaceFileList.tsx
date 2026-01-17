import { useState } from 'react';

import styled from '@emotion/styled';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { useScreenSize } from 'common/hooks/useScreenSize';
import { useTranslation } from 'common/i18n';
import { Id } from 'common/utils/identifier';
import { downloadFiles } from 'common/utils/saveFile';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import EmptyMessagesListPlaceholder from 'components/chat/EmptyMessagesListPlaceholder';
import FileDragBackdrop from 'components/chat/FileDragBackdrop/component';

import { useSpaceFileListViewColumns } from '../useSpaceFileListViewColumns';

import { selectFileSearchValue } from 'models/component/SearchModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { useSelector } from 'react-redux';

import AddFileButton from '../AddFileButton';
import BulkEditMenu from '../BulkEditMenu';
import { DeleteFileModal } from '../DeleteFileModal';
import { calculateTableMinHeight } from '../helpers';
import styles from '../styles.css';
import { getHeaderRenderer } from '../tableCells';
import { ColumnConfig, FileTableColumn, SelectedFileData } from '../types';
import { useSpaceFileList } from '../useSpaceFileList';

interface SpaceFileListViewInterface {
  config?: ColumnConfig[];
  projectId: Id;
  className?: string;

  isBackdropVisible: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDropFile: (files: File[]) => void;
  onPaste: (files: File[]) => void;
  onSetOpenCallback: (setOpenCallback: () => void) => void;
  onOpenFilePrompt: () => void;
}

const ButtonsWrapper = styled.div`
  gap: 1rem;
  display: flex;
`;

const SpaceFileList = ({ className, projectId, ...props }: SpaceFileListViewInterface) => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUserId = useSelector(selectCurrentUserId);
  const { screenHeight } = useScreenSize();
  const { t } = useTranslation();

  const searchValue = useSelector(selectFileSearchValue);

  const { data: sortedData, isLoading, sort, order, sortKey, isConversation } = useSpaceFileList(projectId);

  const filteredData = sortedData.filter((file) => `${file.name}`.toLowerCase().includes(searchValue.toLowerCase()));

  const notAllSelectedFilesOwnedByCurrentUser = selectedFiles.some(({ userId }) => userId !== currentUserId);

  const defaultColumConfig = useSpaceFileListViewColumns({ filteredData, selectedFiles, setSelectedFiles });
  const config = isConversation
    ? defaultColumConfig.filter(({ key }) => key !== FileTableColumn.LOCATION)
    : defaultColumConfig;

  const onDownload = () => {
    downloadFiles(selectedFiles);
  };

  const onDelete = () => {
    setIsModalOpen(true);
  };

  const getRowClass = ({ index, ...props }: { index: number }) => {
    if (index < 0) {
      return styles.header;
    }
    if (index + 1 === filteredData.length) {
      return styles.tableRow;
    }
    return styles.tableRowUnderlined;
  };

  if (isLoading) {
    return (
      <div className={styles.skeletonWrapper}>
        <DefaultContentSkeletonLoader />
      </div>
    );
  }

  return (
    <DropzoneWrapper
      className={styles.dropzoneWrapper}
      noClick
      noKeyboard
      onSetOpenCallback={props.onSetOpenCallback}
      onDrop={props.onDropFile}
      onDragEnter={props.onDragEnter}
      onDragLeave={props.onDragLeave}
      onPaste={props.onPaste}
    >
      {props.isBackdropVisible ? (
        <FileDragBackdrop />
      ) : !sortedData?.length ? (
        <EmptyMessagesListPlaceholder
          title={t('No files yet')}
          subTitle={'Add your first file here'}
          onSubtitleClick={props.onOpenFilePrompt}
          subtitleClassName={styles.emptyListPlaceholderSubtitle}
        />
      ) : (
        <div className={styles.outerScroll}>
          <div
            className={className || styles.innerScroll}
            style={{
              minHeight: calculateTableMinHeight({
                rowCount: filteredData.length,
                screenHeight,
              }),
            }}
          >
            <AutoSizer defaultHeight={20}>
              {({ width, height }) => (
                <Table
                  height={height}
                  width={width}
                  headerHeight={50}
                  overscanRowCount={5}
                  rowHeight={50}
                  rowGetter={({ index }) => filteredData[index]}
                  rowCount={filteredData.length}
                  rowClassName={getRowClass}
                >
                  {config
                    .filter(({ isVisible }) => isVisible)
                    .map(({ headerKey, key, cellRenderer, isSortable, width: columnWidth }) => (
                      <Column
                        key={key}
                        label={headerKey}
                        dataKey={key}
                        cellRenderer={cellRenderer}
                        headerRenderer={getHeaderRenderer(sort, order, sortKey)}
                        disableSort={!isSortable}
                        width={columnWidth}
                      />
                    ))}
                </Table>
              )}
            </AutoSizer>
          </div>
          <ButtonsWrapper>
            <BulkEditMenu
              onDownload={!selectedFiles.length ? null : onDownload}
              onDelete={notAllSelectedFilesOwnedByCurrentUser || !selectedFiles.length ? null : onDelete}
            />
            <AddFileButton projectId={projectId} onClick={props.onOpenFilePrompt} />
          </ButtonsWrapper>
          {isModalOpen && (
            <DeleteFileModal
              fileIds={selectedFiles.map(({ id }) => id)}
              projectId={projectId}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedFiles([]);
              }}
            />
          )}
        </div>
      )}
    </DropzoneWrapper>
  );
};

export default SpaceFileList;

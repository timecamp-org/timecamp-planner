import { FC } from 'react';

import { Button } from '@mui/material';

import { useTranslation } from 'common/i18n/index';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload';
import { onQueueFilesAndStartUploading } from 'models/domain/FilesModel/actions';
import { FileUploaded } from 'models/domain/FilesModel/types';
import { onUploadProjectBackground } from 'models/domain/ProjectsModel/actions';
import { useDispatch } from 'react-redux';

interface UploadBackgroundFileInterface {
  onOpenFilePrompt: VoidFunction;
  onSetOpenCallback: VoidFunction;
  onDropFile: VoidFunction;
  onDragEnter: VoidFunction;
  onDragLeave: VoidFunction;
  onPaste: VoidFunction;
}

const UploadBackgroundFile: FC<UploadBackgroundFileInterface> = (props) => {
  const { t } = useTranslation();

  return (
    <DropzoneWrapper
      noClick
      noKeyboard
      onSetOpenCallback={props.onSetOpenCallback}
      onDrop={props.onDropFile}
      onDragEnter={props.onDragEnter}
      onDragLeave={props.onDragLeave}
      onPaste={props.onPaste}
    >
      <Button variant="text" onClick={props.onOpenFilePrompt}>
        {t('Upload background image')}
      </Button>
    </DropzoneWrapper>
  );
};

const EnhancedUploadBackgroundFile = EnhanceWithFileUpload(UploadBackgroundFile);

export default function ({ projectId }: { projectId: string }) {
  const dispatch = useDispatch();

  const onUploadFiles = (files: FileUploaded[]) => {
    dispatch(onQueueFilesAndStartUploading(files, projectId, projectId, onUploadProjectBackground));
  };

  return <EnhancedUploadBackgroundFile onUploadFiles={onUploadFiles} />;
}

import { FC } from 'react';

import { ButtonBase, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';

import { ArrowDownToLine } from 'commonComponents/Icons/fontawesome/ArrowDowToLine';
import { useTranslation } from 'i18n';
import { onFetchAllTaskAttachments } from 'models/domain/TasksModel/actions';

interface ButtonDownloadAllAttachmentsInterface {
  taskId: string;
}

export const ButtonDownloadAllAttachments: FC<ButtonDownloadAllAttachmentsInterface> = ({ taskId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onFetchAll = () => {
    dispatch(
      onFetchAllTaskAttachments({
        taskId,
      })
    );
  };

  return (
    <Tooltip title={t('Download all files')} placement="top" arrow>
      <ButtonBase onClick={onFetchAll}>
        <ArrowDownToLine />
      </ButtonBase>
    </Tooltip>
  );
};

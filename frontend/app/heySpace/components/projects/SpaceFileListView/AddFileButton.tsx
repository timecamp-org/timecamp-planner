import { Button, SxProps } from '@mui/material';
import { Id } from 'common/utils/identifier';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { useTranslation } from 'i18n';
import { FC } from 'react';

interface AddFileButtonInterface {
  projectId: Id;
  onClick: () => void;
}

const buttonStyles: SxProps = {
  padding: '0.25rem 1rem',
  gap: '0.5rem',
};

const AddFileButton: FC<AddFileButtonInterface> = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <Button variant="outlined" size="small" sx={buttonStyles} onClick={onClick}>
      {t('Add file')} <Plus />
    </Button>
  );
};

export default AddFileButton;

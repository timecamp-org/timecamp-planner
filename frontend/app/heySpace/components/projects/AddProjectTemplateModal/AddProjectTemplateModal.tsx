import { FC } from 'react';

import { Button, Checkbox } from '@mui/material';

import { Id } from 'common/utils/identifier';
import UnderlinedUserInput from 'commonComponents/UnderlinedUserInput';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';

import { useAddProjectTemplate } from './hooks';
import { CheckboxWrapper, Footer, Label, modalBodyClass, Text } from './styled';

interface AddProjectTemplateModalInterface {
  isOpen: boolean;
  onClose: VoidFunction;
  projectId: Id;
}

export const AddProjectTemplateModal: FC<AddProjectTemplateModalInterface> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation();
  const { isLoading, onChange, onSave, error, name, includeTasks, toggleIncludeTasks } = useAddProjectTemplate({
    onClose,
    projectId,
  });

  return (
    <UniversalModal
      modalBodyClassName={modalBodyClass}
      isModalOpen={isOpen}
      onBackdropClick={onClose}
      onSetIsModalOpen={onClose}
      header={t('SAVE BOARD TEMPLATE')}
      footer={
        <Footer>
          <Button variant="text" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={onSave} disabled={isLoading}>
            {t(isLoading ? 'Saving' : 'Save')}
          </Button>
        </Footer>
      }
    >
      <Text>{t('Custom templates are available for all members of your company.')}</Text>

      <UnderlinedUserInput
        shouldFocusOnMount
        addEmptyMessageSpace
        value={name}
        placeholder={t('Name your template')}
        onChange={onChange}
        humanMessage={error}
      />
      <CheckboxWrapper>
        <Checkbox id={t('Include tasks')} checked={includeTasks} onChange={toggleIncludeTasks} />
        <Label htmlFor={t('Include tasks')}>{t('Include tasks')}</Label>
      </CheckboxWrapper>
    </UniversalModal>
  );
};

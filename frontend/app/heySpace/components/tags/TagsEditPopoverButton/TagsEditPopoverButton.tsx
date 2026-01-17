import { FC } from 'react';

import { Tags } from 'commonComponents/Icons/fontawesome/Tags';
import { ButtonPopover } from 'components/buttons/ButtonPopover';
import { useTranslation } from 'i18n';

import TagsInputList from '../TagsInputList';

import styles from './styles.css';

export interface TagsEditPopoverButtonInterface {
  taskId: string;
}

export const TagsEditPopoverButton: FC<TagsEditPopoverButtonInterface> = ({ taskId }) => {
  const { t } = useTranslation();

  return (
    <ButtonPopover
      showCloseButton
      buttonDashed
      targetContent={<Tags size="sm" className={styles.icon} />}
      popperComponent={
        <>
          <div>{t('Select tags')}</div>

          <TagsInputList objectId={taskId} shouldFocusOnMount />
        </>
      }
    />
  );
};

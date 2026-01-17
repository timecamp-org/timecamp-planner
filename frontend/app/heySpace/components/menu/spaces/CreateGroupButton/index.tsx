import { FC } from 'react';

import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import colors from 'styles/colors.css';

import { Folders } from '../../../common/Icons/fontawesome/Folders';

import useComponent from './hook';
import styles from './styles.css';

export type CreateGroupButtonInterface = {
  className?: string;
};

const CreateGroupButton: FC<CreateGroupButtonInterface> = (props) => {
  const { t } = useTranslation();
  const { hasAccessToProjectGroups, onCreateProjectGroup } = useComponent();

  return (
    <TooltipedDisabledElement
      isDisabled={!hasAccessToProjectGroups}
      message={t(`To use our awesome Project Groups feature upgrade to Premium!`)}
    >
      <SecondaryButton
        className={props.className || styles.button}
        color={colors.blueGreyColor}
        shouldChangeColorOnHover={false}
        isDisabled={!hasAccessToProjectGroups}
        onClick={onCreateProjectGroup}
      >
        <Folders className={styles.icon} />
        {t('Create Group')}
      </SecondaryButton>
    </TooltipedDisabledElement>
  );
};

export default CreateGroupButton;

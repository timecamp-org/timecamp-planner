import { Button, SxProps } from '@mui/material';
import { useSelector } from 'common/hooks/useSelector';
import { Telescope } from 'commonComponents/Icons';
import { selectCurrentOrganizationName } from 'models/domain/OrganizationsModel/selectors/domain';
import { FC } from 'react';
import styles from './styles.css';

import { Plus } from 'components/common/Icons/fontawesome/Plus';
import { useTranslation } from 'i18n';
import { useDispatch } from 'react-redux';

import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { OpenMobileSidebarButton } from 'components/responsive/OpenMobileSidebarButton';

type OverwatchHeaderInterface = {
  className?: string;
};

const addProjectButtonStyles: SxProps = {
  color: 'var(--color-gray-900)',
  marginLeft: 'auto',
  fontWeight: 'var(--fontWeight-regular)',
  gap: '1rem',
};

const OverwatchHeader: FC<OverwatchHeaderInterface> = (props) => {
  const currentOrganizationName = useSelector((state) => selectCurrentOrganizationName(state));
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const onClick = () => dispatch(onOpenModal(ModalType.MANAGE_OVERWATCH_MODAL));
  return (
    <div className={props.className || styles.component}>
      <OpenMobileSidebarButton className={styles.icon} />

      <div className={styles.icon}>
        <Telescope />
      </div>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{'OverWatch'}</span>
        <span className={styles.workspaceName}>{currentOrganizationName}</span>
      </div>

      <Button variant="text" sx={addProjectButtonStyles} onClick={onClick}>
        <Plus />
        {t('Add project')}
      </Button>
    </div>
  );
};

export default OverwatchHeader;

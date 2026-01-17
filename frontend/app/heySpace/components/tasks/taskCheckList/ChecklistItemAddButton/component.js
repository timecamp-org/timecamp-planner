import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { useTranslation } from 'i18n';

import styles from './styles.css';

ChecklistItemAddButton.propTypes = {
  onAddChecklistItem: PropTypes.func,
};

ChecklistItemAddButton.defaultProps = {
  onAddChecklistItem: doNothing,
};

function ChecklistItemAddButton(props) {
  const { t } = useTranslation();

  return (
    <Button variant="text-reversed" size="xs" onClick={props.onAddChecklistItem}>
      <Plus className={styles.icon} />
      <span> {t('Add element to a checklist')}</span>
    </Button>
  );
}

export default ChecklistItemAddButton;

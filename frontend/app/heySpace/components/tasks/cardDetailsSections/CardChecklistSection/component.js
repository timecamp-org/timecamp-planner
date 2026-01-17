import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { Checklist as ChecklistIcon } from 'commonComponents/Icons';
import TaskChecklistWithAddItemButton from '../../taskCheckList/TaskChecklistWithAddItemButton';
import { useTranslation } from 'i18n';
import ChecklistProgress from 'commonComponents/ChecklistProgress';

CardChecklistSection.propTypes = {
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  isFocused: PropTypes.bool,
  isChecklistEmpty: PropTypes.bool,

  onClick: PropTypes.func,
};

CardChecklistSection.defaultProps = {
  isFocused: false,
  isChecklistEmpty: true,

  onClick: doNothing,
};

function CardChecklistSection(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.Component}>
      <div className={styles.sectionHeader}>
        <SecondaryButton
          className={styles.button}
          color={props.color}
          onClick={props.onClick}
        >
          <ChecklistIcon className={styles.icon} />
          <div className={styles.title}>{t('Checklist')}</div>
        </SecondaryButton>
        {!props.isChecklistEmpty && (
          <ChecklistProgress taskId={props.taskId} shouldRenderIcon={false} />
        )}
      </div>
      <div className={styles.right}>
        <TaskChecklistWithAddItemButton
          taskId={props.taskId}
          color={props.color}
        />
      </div>
    </div>
  );
}

export default CardChecklistSection;

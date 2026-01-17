import { TemplateAssigneePlaceholderIcon, TemplateChecklistIcon } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

import styles from '../styles.css';
import { getColor, getProgressPlaceholder, getRandomBoolean, getTagPlaceholder, getToday } from '../utils';

export const TagsPlaceholder = () => (
  <div className={styles.tags}>
    <div className={styles.tag} style={{ backgroundColor: getColor() }}>
      {getTagPlaceholder()}
    </div>
    <div className={styles.tag} style={{ backgroundColor: getColor() }}>
      {getTagPlaceholder()}
    </div>
    <div className={styles.moreTags}>+2</div>
  </div>
);

export const AssigneePlaceholder = () =>
  getRandomBoolean() ? (
    <div className={styles.roundButton}>{/* <AssigneePicker /> */}</div>
  ) : (
    <div className={styles.assigneePhoto}>
      <TemplateAssigneePlaceholderIcon />
    </div>
  );

export const ChecklistPlaceholder = () =>
  getRandomBoolean() ? (
    <div className={styles.checklist}>
      <TemplateChecklistIcon />
      <span>1/4</span>
    </div>
  ) : (
    <div className={`${styles.checklist} ${styles.empty}`}>
      <TemplateChecklistIcon />
      <span>0/0</span>
    </div>
  );

const TODAY = getToday();

export const DueDatePlaceholder = () => {
  const { t } = useTranslation();

  return getRandomBoolean() ? <div>{TODAY}</div> : <div className={styles.empty}>{t('Set date')}</div>;
};

export const ProgressPlaceholder = () => {
  const progress = getProgressPlaceholder();
  const color = progress > 0 ? styles.blue : '';

  return <div className={`${styles.progress} ${color}`}>{progress}%</div>;
};

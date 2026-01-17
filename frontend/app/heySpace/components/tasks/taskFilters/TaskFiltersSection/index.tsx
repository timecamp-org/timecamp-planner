import { doNothing } from 'common/utils';
import styles from './styles.css';

import { ChevronDown, ChevronUp } from 'commonComponents/Icons';
import { useTranslation } from 'i18n';

export type TaskFiltersSectionInterface = {
  className?: string;
  header?: string;
  isExpanded?: boolean;
  hiddenCount?: number;
  isCollapsable?: boolean;
  onSetIsExpanded?: (isExpanded: boolean) => void;
};

const defaultProps = {
  header: '',
  isExpanded: false,
  isCollapsable: true,
  hiddenCount: 0,
  onSetIsExpanded: doNothing,
};

const TaskFiltersSection: ReactFCWithChildren<TaskFiltersSectionInterface> = (props) => {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.section}>
      <div className={styles.subHeader}>{props.header}</div>
      <div className={`${styles.optionList} ${props.isExpanded ? styles.expanded : ''}`}>{props.children}</div>
      {props.isCollapsable && props.hiddenCount > 0 ? (
        <div className={styles.showMore} onClick={() => props.onSetIsExpanded(!props.isExpanded)}>
          {props.isExpanded ? `${t('Hide')} (${props.hiddenCount})` : `${t('Show more')} (${props.hiddenCount})`}
          {props.isExpanded ? <ChevronUp className={styles.chevron} /> : <ChevronDown className={styles.chevron} />}
        </div>
      ) : null}
    </div>
  );
};

TaskFiltersSection.defaultProps = defaultProps;

export default TaskFiltersSection;

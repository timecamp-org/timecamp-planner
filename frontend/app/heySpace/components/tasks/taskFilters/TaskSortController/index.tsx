import { FC } from 'react';

import { Id } from 'common/utils/identifier';
import { ArrowDownLong } from 'commonComponents/Icons/fontawesome/ArrowDownLong';
import { ArrowUpLong } from 'commonComponents/Icons/fontawesome/ArrowUpLong';
import { SortOrder } from 'models/component/FiltersModel/types';
import { getConditionalClass } from 'utils/getConditionalClass';

import useComponent from './hook';
import styles from './styles.css';

export type TaskSortControllerInterface = {
  className?: string;
  filterId: Id;
  sortKey: string;
  disableSort: boolean;
};

const TaskSortController: ReactFCWithChildren<TaskSortControllerInterface> = (props) => {
  const hook = useComponent(props);

  return (
    <div
      className={`${props.className || styles.Component} ${getConditionalClass(styles.sortable, !props.disableSort)} ${
        styles.position
      }`}
      onClick={hook.onToggleSortOrder}
    >
      {props?.children}
      {!props.disableSort && (
        <div className={`${styles.chevronWrapper} `}>
          {hook.sortOrder === SortOrder.DESC && <ArrowUpLong size="xs" />}
          {hook.sortOrder === SortOrder.ASC && <ArrowDownLong size="xs" />}
        </div>
      )}
    </div>
  );
};

export default TaskSortController;

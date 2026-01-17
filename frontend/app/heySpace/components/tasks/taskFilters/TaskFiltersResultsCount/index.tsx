import { FC } from 'react';

import isNil from 'lodash/isNil';

import { Id } from 'common/utils/identifier';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';

import useComponent from './hook';
import styles from './styles.css';

export type TaskFiltersResultsCountInterface = {
  containerType: TaskFiltersContainerType;
  targetType: TaskFiltersTargetType;
  containerId: Id;
  filterId: Id;
  filterPath: string[];
  className?: string;
};

const TaskFiltersResultsCount: FC<TaskFiltersResultsCountInterface> = (props) => {
  const { resultsCount } = useComponent(props);

  if (isNil(resultsCount)) {
    return null;
  } else {
    return <div className={props.className || styles.Component}>{`(${resultsCount})`}</div>;
  }
};

export default TaskFiltersResultsCount;

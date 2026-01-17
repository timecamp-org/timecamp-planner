import { Search } from 'commonComponents/Icons/fontawesome/Search';
import SecondaryButton from 'components/buttons/SecondaryButton';
import TaskSearch from 'components/tasks/taskFilters/TaskSearch';

import { ICON_COLOR } from '../../const';
import styles from '../../styles.css';
import { BaseHeaderProps } from '../../types';

type TaskSearchOrSearchIconProps = Pick<
  BaseHeaderProps,
  'isTaskSearchFocused' | 'projectId' | 'onSetIsTaskSearchFocused' | 'projectColor'
>;

const SearchOrIcon = (props: TaskSearchOrSearchIconProps) =>
  props.isTaskSearchFocused ? (
    <TaskSearch
      className={styles.taskSearch}
      projectId={props.projectId}
      isFocused={props.isTaskSearchFocused}
      onSetIsFocused={props.onSetIsTaskSearchFocused}
    />
  ) : (
    <div>
      <SecondaryButton
        color={props.projectColor || ICON_COLOR}
        className={styles.link}
        onClick={() => props.onSetIsTaskSearchFocused(true)}
      >
        <Search />
      </SecondaryButton>
    </div>
  );

export default SearchOrIcon;

import { FC, useState } from 'react';

import { useLocation } from 'react-router';

import { Id } from 'common/utils/identifier';
import { Search } from 'commonComponents/Icons/fontawesome/Search';
import { MyTasks } from 'commonComponents/Icons/index-NEW';
import NavTabs from 'commonComponents/NavTabs';
import SecondaryButton from 'components/buttons/SecondaryButton';
import TabNavButton from 'components/buttons/TabNavButton';
import AddCardIcon from 'components/tasks/AddCardIcon';
import TaskSearch from 'components/tasks/taskFilters/TaskSearch';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import MyTasksFilters from '../MyTasksFilters';
import { MyTasksPanelType } from '../types';

import useComponent from './hook';
import styles from './styles.css';
import { OpenMobileSidebarButton } from 'components/responsive/OpenMobileSidebarButton';

type MyTasksHeaderInterface = {
  className?: string;
  filterId: Id;
  selfConversationProjectId: Id;
};

const MyTasksHeader: FC<MyTasksHeaderInterface> = (props) => {
  const { myTasksPanelType } = useComponent();
  const [isFocused, onSetIsTaskSearchFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.component}>
      <OpenMobileSidebarButton className={styles.icon} />

      <div className={styles.icon}>
        <MyTasks />
      </div>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{t('My Tasks')}</span>
        {renderNavigation(t, myTasksPanelType)}
      </div>
      {myTasksPanelType !== MyTasksPanelType.TIMELINE &&
        renderHeaderRight(props, isFocused, onSetIsTaskSearchFocused, t)}
    </div>
  );
};

function renderHeaderRight(
  props: MyTasksHeaderInterface,
  isFocused: boolean,
  onSetIsTaskSearchFocused: (isFocused: boolean) => void,
  t: TranslateFunction,
) {
  return (
    <div className={styles.headerRight}>
      {renderTaskSearch(props, isFocused, onSetIsTaskSearchFocused, t)}

      <AddCardIcon className={styles.link} taskCreateSource={TaskCreateSource.MY_TASKS} shouldAutoAssign />

      <MyTasksFilters />
    </div>
  );
}

function renderNavigation(t: TranslateFunction, myTasksPanelType: MyTasksPanelType) {
  const { pathname } = useLocation();

  const name = pathname?.replace('/myTasks/', '');

  return (
    <div className={styles.navigation}>
      <NavTabs
        selectedTab={name}
        tabs={[
          {
            name: 'list',
            Component: (
              <TabNavButton isActive={myTasksPanelType === MyTasksPanelType.LIST} to={'/myTasks/list'}>
                {t('List')}
              </TabNavButton>
            ),
          },
          {
            name: 'calendar',
            Component: (
              <TabNavButton isActive={myTasksPanelType === MyTasksPanelType.CALENDAR} to={'/myTasks/calendar'}>
                {t('Calendar')}
              </TabNavButton>
            ),
          },
          {
            name: 'timeline',
            Component: (
              <TabNavButton isActive={myTasksPanelType === MyTasksPanelType.TIMELINE} to={'/myTasks/timeline'}>
                {t('Timeline')}
              </TabNavButton>
            ),
          },
        ]}
      />
    </div>
  );
}

function renderTaskSearch(
  props: MyTasksHeaderInterface,
  isFocused: boolean,
  onSetIsTaskSearchFocused: (isFocused: boolean) => void,
  t,
) {
  return isFocused ? (
    <TaskSearch
      filterId={props.filterId}
      projectId={props.selfConversationProjectId}
      className={styles.taskSearch}
      innerClassName={styles.taskSearchInput}
      isFocused={isFocused}
      onSetIsFocused={onSetIsTaskSearchFocused}
      placeholder={t('Search task')}
    />
  ) : (
    <div>
      <SecondaryButton className={styles.link} onClick={() => onSetIsTaskSearchFocused(true)}>
        <Search />
      </SecondaryButton>
    </div>
  );
}

export default MyTasksHeader;

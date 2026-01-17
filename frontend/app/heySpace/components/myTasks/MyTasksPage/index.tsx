import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import NoProjectsPage from 'components/pages/NoProjectsPage/NoProjectsPage';
import React, { memo } from 'react';
import { Route as Case, Redirect, Switch } from 'react-router-dom';
import MyTasksCalendar from '../MyTasksCalendar';
import MyTasksHeader from '../MyTasksHeader';
import MyTasksTable from '../MyTasksTable';
import MyTasksTimeline from '../MyTasksTimeline';
import useComponent from './hook';
import styles from './styles.css';

const MyTasksPage: React.FC = () => {
  const { isLoading, filterId, selfConversationProjectId, shouldRenderPlaceholder } = useComponent();

  if (shouldRenderPlaceholder) {
    return <NoProjectsPage />;
  }
  return (
    <div className={styles.component}>
      <MyTasksHeader filterId={filterId} selfConversationProjectId={selfConversationProjectId} />
      <div className={styles.container}>{isLoading ? renderSkeleton() : renderContent()}</div>
    </div>
  );
};

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <DefaultContentSkeletonLoader />
    </div>
  );
}

function renderContent() {
  return (
    <SuspenseComponent>
      <Switch>
        <Case exact path={'/myTasks'} component={() => <Redirect to={'/myTasks/list'} />} />
        <Case path={'/myTasks/list'} component={MyTasksTable} />
        <Case path={'/myTasks/calendar'} component={MyTasksCalendar} />
        <Case path={'/myTasks/timeline'} component={MyTasksTimeline} />
      </Switch>
    </SuspenseComponent>
  );
}

export default memo(MyTasksPage, () => true);

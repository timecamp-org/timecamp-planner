import { lazy } from 'react';

import { Route as Case, Switch } from 'react-router-dom';

import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import Sidebar from 'components/menu/Sidebar';
import ProjectView from 'components/projects/ProjectView';

import styles from './styles.css';
const OverwatchPage = lazy(() => import('../../overwatch/OverwatchPage'));
const MyTasksPage = lazy(() => import('../../myTasks/MyTasksPage'));
const SchedulePage = lazy(() => import('../../schedule/SchedulePage'));
const ChatWithMeForm = lazy(() => import('components/chatWithMe/ChatWithMeForm'));

function PageWithMainMenu(props) {
  const isChatWithMePage = props.match.params.pageType === 'chatWithMe';

  return (
    <div className={styles.component}>
      <Switch>
        {/* main menu needs projectId in its props.match.params
          and because of that we have to specify in this switch case that this param can occure */}
        <Case path="/chatWithMe" component={Sidebar} />
        <Case path="/:objectType/:projectId?/:projectPanelType?/:rightPanelType?/:taskId?" component={Sidebar} />
      </Switch>
      <div className={isChatWithMePage ? styles.chatWithMePage : styles.main}>
        <SuspenseComponent disableLoader={true}>
          <Switch>
            <Case path="/chatWithMe" component={ChatWithMeForm} />
            <Case path="/overwatch" component={OverwatchPage} />
            <Case path="/myTasks/:myTasksPanelType?" component={MyTasksPage} />
            <Case path="/schedule" component={SchedulePage} />
            <Case
              path="/:objectType/:projectId?/:projectPanelType?/:rightPanelType?/:taskId?"
              component={ProjectView}
            />
          </Switch>
        </SuspenseComponent>
      </div>
    </div>
  );
}

export default PageWithMainMenu;

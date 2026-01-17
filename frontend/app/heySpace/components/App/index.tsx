// @ts-nocheck

import React, { lazy } from 'react';

import { DragDropContext } from '@hello-pangea/dnd';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route as Case, Router as RoutingProvider, Switch } from 'react-router-dom';

import { history } from 'common/rootStore';
import AppEventsTracker from 'commonComponents/AppEventsTracker';
import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import CustomerMessagingPlatform from 'commonComponents/CustomerMessagingPlatform';
import GlobalErrorBoundary from 'commonComponents/GlobalErrorBoundary';
import OnlineDetector from 'commonComponents/OnlineDetector';
import TabController from 'commonComponents/TabController';
import PopUpAlerts from 'components/alerts/PopUpAlerts';
import NewMessageSound from 'components/chat/NewMessageSound';
import RedirectToDefaultPage from 'components/routing/RedirectTo/defaultPage';
import RedirectToFirstProjectTasks from 'components/routing/RedirectTo/firstProjectTasksPage';

import { CssVarsTheme, MaterialThemeProvider } from '../../theme';
import './assets/global.css';

import styles from './assets/styles.css';
import { useComponent } from './hook';
import { useDragDrop } from './useDragDrop';
// @ts-ignore

import { ResponsiveContextProvider } from 'components/responsive/ResponsiveContext';
import { useInitializeUserTracker } from 'hooks/userTracker/useInitilalizeUserTracker';

const OAuth2ConsentPage = lazy(() => import('components/auth/OAuth2ConsentPage'));
const SettingsPage = lazy(() => import('components/settings/SettingsPage'));
const PageWithMainMenu = lazy(() => import('components/projects/PageWithMainMenu'));
const SignInPage = lazy(() => import('components/auth/signIn/SignInPage'));
const SignUpPage = lazy(() => import('components/auth/signUp/SignUpPage'));
const NotFoundPage = lazy(() => import('components/pages/NotFoundPage'));
const ForgottenPasswordPage = lazy(() => import('components/auth/forgottenPassword/ForgottenPasswordPage'));
const ChangePasswordPage = lazy(() => import('components/changePassword/ChangePasswordPage'));
const SignInOfflinePage = lazy(() => import('components/auth/OfflinePageWithRetryButton/signIn'));
const SignUpOfflinePage = lazy(() => import('components/auth/OfflinePageWithRetryButton/signUp'));
const ForgottenPasswordOfflinePage = lazy(() => import('components/auth/OfflinePageWithRetryButton/forgottenPassword'));
const ChangePasswordOfflinePage = lazy(() => import('components/auth/OfflinePageWithRetryButton/changePassword'));
const ChangePasswordLinkExpiredPage = lazy(() => import('components/changePassword/ChangePasswordLinkExpiredPage'));
const NewWorkspacePage = lazy(() => import('components/workspace/NewWorkspacePage'));
const WorkspaceInvitationsPage = lazy(() => import('components/workspace/WorkspaceInvitationsPage'));
const JoinChatWithMePage = lazy(() => import('components/chatWithMe/JoinChatWithMePage'));
const GlobalModals = lazy(() => import('commonComponents/GlobalModals'));
// @ts-ignore
const RedirectToWorkspaceInvitationPage = lazy(() => import('components/routing/RedirectTo/workspaceInvitationsPage'));

const queryClient = new QueryClient();
const App: React.FC = () => {
  useInitializeUserTracker();
  const { hasLoaded } = useComponent();
  const { onDragStart, onDragEnd } = useDragDrop();

  if (!hasLoaded) {
    // we return null because we render loader outside of React if app is loading
    return null;
  }

  return (
    // @ts-ignore
    <GlobalErrorBoundary>
      <CssVarsTheme>
        <MaterialThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ResponsiveContextProvider>
              <RoutingProvider history={history}>
                <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                  {renderApp()}
                </DragDropContext>
              </RoutingProvider>
            </ResponsiveContextProvider>
          </QueryClientProvider>
        </MaterialThemeProvider>
      </CssVarsTheme>
    </GlobalErrorBoundary>
  );
};

const renderApp = () => (
  <div className={styles.app} id={'appContent'}>
    <PopUpAlerts />
    <TabController />
    <AppEventsTracker />
    <OnlineDetector />
    <NewMessageSound />

    <SuspenseComponent disableLoader>
      <GlobalModals />
    </SuspenseComponent>

    <Case
      render={(routerProps) => (
        <div className={styles.mainContent}>
          <SuspenseComponent>
            <Switch>
              <Case exact path="/" component={RedirectToDefaultPage} />

              {/* Settings */}
              <Case path="/settings" component={SettingsPage} />

              <Case path="/oauth/authorize" component={OAuth2ConsentPage} />

              {/* login, registration etc unauthorized pages */}
              <Case path="/login" component={SignInPage} />
              <Case path="/loginOffline" component={SignInOfflinePage} />
              <Case path="/register" component={SignUpPage} />
              <Case path="/registerOffline" component={SignUpOfflinePage} />
              <Case path="/forgottenPassword" component={ForgottenPasswordPage} />
              <Case path="/forgottenPasswordOffline" component={ForgottenPasswordOfflinePage} />
              <Case path="/changePassword" component={ChangePasswordPage} />
              <Case path="/changePasswordLinkExpired" component={ChangePasswordLinkExpiredPage} />
              <Case path="/changePasswordOffline" component={ChangePasswordOfflinePage} />
              <Case path="/newWorkspace" component={NewWorkspacePage} />
              <Case path="/first-workspace-creation-success" component={RedirectToWorkspaceInvitationPage} />
              <Case path="/workspaceInvitations" component={WorkspaceInvitationsPage} />
              <Case path="/chatWithMe/join/:inviteToken" component={JoinChatWithMePage} />

              {/* Projects */}
              <Case exact path="/projects" component={RedirectToFirstProjectTasks} />
              <Case path="/:pageType" component={PageWithMainMenu} />
              <Case component={NotFoundPage} />
            </Switch>
          </SuspenseComponent>
          <CustomerMessagingPlatform />
        </div>
      )}
    />
  </div>
);

export default App;

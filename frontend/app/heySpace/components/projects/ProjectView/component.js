import { memo } from 'react';

import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route as IfUrl, Switch as MatchOne } from 'react-router-dom';

import { useSelector } from 'common/hooks/useSelector';
import LoadingDots from 'commonComponents/LoadingDots';
import RightPanelChatWrapper from 'components/chat/rightPanelChat/RightPanelChatWrapper';
import { NavigationHistoryProvider } from 'components/menu/NavigationHistoryArrows/context';
import ForbiddenPage from 'components/pages/ForbiddenPage';
import NoProjectsPage from 'components/pages/NoProjectsPage/NoProjectsPage';
import FirstProjectPlaceholder from 'components/projects/FirstProjectPlaceholder';
import ProjectMessageBoard from 'components/projects/ProjectMessageBoard';
import ProjectViewHeader from 'components/projects/ProjectViewHeader';
import { OpenMobileSidebarButton } from 'components/responsive/OpenMobileSidebarButton';
import { i18n } from 'i18n';
import { selectHasCurrentOrganizationNonDirectNotArchivedProjectsData } from 'models/domain/ProjectsModel/selectors';

import { RightPanelProvider } from '../../chat/rightPanelChat/RightPanelChat/context';

import LoadingPage from 'components/pages/LoadingPage';
import { selectIsLoadingGetOrganizationProjectsRequestStatus } from 'models/domain/RequestModel/selectors/organizationRequest';
import styles from './styles.css';

const queryClient = new QueryClient();

ProjectView.propTypes = {
  objectId: PropTypes.string.isRequired,
  hasAccessToProject: PropTypes.bool,
  isChat: PropTypes.bool,
  isKanban: PropTypes.bool,
  isLoading: PropTypes.bool,
  isFailure: PropTypes.bool,
  shouldRenderFirstProjectPlaceholder: PropTypes.bool,
};

ProjectView.defaultProps = {
  hasAccessToProject: false,
  isChat: true,
  isKanban: true,
  shouldRenderFirstProjectPlaceholder: false,
};

function ProjectView(props) {
  const hasCurrentOrganizationNonDirectProjectsData = useSelector(
    selectHasCurrentOrganizationNonDirectNotArchivedProjectsData,
  );

  const isLoading = useSelector(selectIsLoadingGetOrganizationProjectsRequestStatus);

  if (isLoading) {
    return <LoadingPage />;
  }

  const shouldRenderLoading = props.isLoading && !props.isFailure;
  const shouldRenderError = props.isFailure && !props.isLoading;
  const shouldRenderContent = !props.isFailure && !props.isLoading;

  if (!props.hasAccessToProject) {
    return <ForbiddenPage buttonText={i18n.t('Go back to project')} returnLink={'/'} />;
  }

  if (props.shouldRenderFirstProjectPlaceholder) {
    return <FirstProjectPlaceholder />;
  }

  if (!hasCurrentOrganizationNonDirectProjectsData) {
    return <NoProjectsPage />;
  }

  return (
    <NavigationHistoryProvider>
      <QueryClientProvider client={queryClient}>
        <div className={styles.projectLayout}>
          {shouldRenderLoading && renderLoading()}

          {shouldRenderError && renderErrorMessage()}

          {props.isFailure || renderHeaderWithContent(props, shouldRenderContent)}
        </div>
      </QueryClientProvider>
    </NavigationHistoryProvider>
  );
}

function renderHeaderWithContent(props, shouldRenderContent) {
  return (
    <RightPanelProvider projectId={props.objectId}>
      <div className={props.isChat ? styles.chatContainer : styles.kanbanContainer}>
        {renderHeader(props)}

        {shouldRenderContent && renderContent(props)}
      </div>
    </RightPanelProvider>
  );
}

function renderHeader(props) {
  return (
    <div className={styles.headerWrapper}>
      <OpenMobileSidebarButton />
      <ProjectViewHeader
        projectId={props.objectId}
        projectPanelType={props.projectPanelType}
        rightPanelType={props.rightPanelType}
      />
    </div>
  );
}

function renderLoading() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots />
    </div>
  );
}

function renderContent(props) {
  return (
    <div className={props.isChat ? styles.chatContent : styles.content}>
      <div className={styles.contentTop}></div>
      <div className={props.isChat ? styles.headerWithChat : styles.headerWithKanban}>
        {props.isChat && renderMessageBoard()}
      </div>

      <RightPanelChatWrapper objectId={props.objectId} isKanban={props.isKanban} isChat={props.isChat} />
    </div>
  );
}

function renderErrorMessage() {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.mascot} />
      <div className={styles.errorMessageText}>
        {i18n.t('Something went wrong, please refresh the page and try again.')}
      </div>
    </div>
  );
}

function renderMessageBoard() {
  return (
    <div className={styles.messageBoard}>
      <MatchOne>
        <IfUrl path="/:objectType/:projectId/chat/:rightPanelType?/:taskId?" component={ProjectMessageBoard} />
      </MatchOne>
    </div>
  );
}

export default memo(ProjectView);

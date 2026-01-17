import React, { lazy, memo } from 'react';

import { Route } from 'react-router-dom';

import { Id } from 'common/utils/identifier';
import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import LoadingDots from 'commonComponents/LoadingDots';
import BoardSkeletonLoader from 'commonComponents/skeletons/BoardSkeletonLoader';

import useRightPanelChatPersister from '../RightPanelChat/useRightPanelChatPersister';

import useComponent, { RightPanelChatWrapperHookInterface } from './hook';
import styles from './styles.css';

const RightPanelChat = lazy(() => import('../RightPanelChat'));

export type RightPanelChatWrapperInterface = {
  objectId: Id;
  isKanban: boolean;
  isChat: boolean;
};

const defaultProps = {
  isKanban: false,
  isChat: false,
};

const RightPanelChatWrapper: React.FC<RightPanelChatWrapperInterface> = (props) => {
  const hook = useComponent(props);
  const { isRightPanelChatOpen } = useRightPanelChatPersister();
  const shouldRenderRightPanelChat = isRightPanelChatOpen || !props.isChat;

  return (
    <div className={getWrapperClassName(props, hook, isRightPanelChatOpen)}>
      {hook.isProjectViewDataRequestLoading && renderLoader(props.isChat)}
      {shouldRenderRightPanelChat && renderRightPanelChat(props, hook)}
    </div>
  );
};

function renderRightPanelChat(props: RightPanelChatWrapperInterface, hook: RightPanelChatWrapperHookInterface) {
  return (
    <SuspenseComponent fallback={renderLoader(props.isChat)}>
      <Route
        path="/:objectType/:projectId/:projectPanelType/:rightPanelType?/:taskId?"
        render={(routeProps) => <RightPanelChat {...routeProps} onMount={hook.onSetRightPanelChatAsLoaded} />}
      />
    </SuspenseComponent>
  );
}

function getWrapperClassName(
  props: RightPanelChatWrapperInterface,
  hook: RightPanelChatWrapperHookInterface,
  isRightPanelOpened: boolean
) {
  if (!props.isChat) {
    return styles.wrapperInKanban;
  } else {
    return isRightPanelOpened
      ? !hook.isRightPanelComponentLoaded || hook.prevProjectId !== hook.projectId
        ? styles.wrapperInstantOpened
        : styles.wrapper
      : hook.prevProjectId !== hook.projectId
        ? styles.wrapperInstantClosed
        : styles.wrapperClosed;
  }
}

function renderLoader(isChat: boolean) {
  return (
    <div className={isChat ? styles.dotsLoader : styles.dotsLoaderWide}>
      {isChat ? <LoadingDots /> : <BoardSkeletonLoader />}
    </div>
  );
}

RightPanelChatWrapper.defaultProps = defaultProps;

export default memo(RightPanelChatWrapper);

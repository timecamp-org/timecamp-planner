import { MouseEventHandler, RefObject, SyntheticEvent, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import usePrevious from 'common/hooks/usePrevious';
import { makeConversationLink } from 'common/utils/routerHelpers';
import useDefaultUrl from 'hooks/routing/useDefaultUrl';

import { useDataPersister, useDataProvider } from './dataHooks';

import { DirectChatNavLinkInterface } from './index';

type DirectChatNavLinkHookInterface = {
  currentUserId: string;
  conversationUserId: string;
  userName: string;

  isConversationWithBot: boolean;
  projectId: string;
  projectHasUnreadMessages: boolean;
  isUserActive: boolean;
  onHideConversation: MouseEventHandler<HTMLDivElement>;
  innerRef: RefObject<HTMLAnchorElement>;
  onClick: VoidFunction;
};

export const useComponent = (props: DirectChatNavLinkInterface): DirectChatNavLinkHookInterface => {
  const history = useHistory();
  const dataProvider = useDataProvider(props);
  const dataPersister = useDataPersister(props);

  const innerRef = useRef();
  const prevIsSelected = usePrevious(props.isSelected);
  const defaultUrl = useDefaultUrl();

  const onHideConversation = useCallback(
    (event: SyntheticEvent): void => {
      event.stopPropagation();
      event.preventDefault();
      dataPersister.onHideConversation();
      if (props.isSelected) {
        history.push(defaultUrl);
      }
    },
    [dataPersister.onHideConversation, props.isSelected, defaultUrl, history]
  );

  const onClick = useCallback(() => {
    const { people, conversationId } = props;
    dataPersister.onCreateConversationIfDoesNotExist(people);

    if (!props.isSelected) {
      history.push(makeConversationLink(conversationId));
    }
  }, [props.isSelected, props.people, props.conversationId, history]);

  useEffect(() => {
    if (!prevIsSelected && props.isSelected) {
      if (innerRef.current) {
        scrollIntoViewIfNeeded(innerRef.current, {
          block: 'nearest',
          behavior: 'smooth',
          scrollMode: 'if-needed',
        });
      }
    }
  }, [props.isSelected, prevIsSelected]);

  return {
    currentUserId: dataProvider.currentUserId,
    conversationUserId: dataProvider.conversationUserId,
    isConversationWithBot: dataProvider.isConversationWithBot,
    projectId: dataProvider.projectId,
    isUserActive: dataProvider.isUserActive,
    projectHasUnreadMessages: dataProvider.projectHasUnreadMessages,
    userName: dataProvider.userName,
    onHideConversation,
    innerRef,
    onClick,
  };
};

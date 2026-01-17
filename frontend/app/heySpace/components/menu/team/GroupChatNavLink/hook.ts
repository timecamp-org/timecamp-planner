import { MouseEvent, MouseEventHandler, RefObject, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import usePrevious from 'common/hooks/usePrevious';
import { Id } from 'common/utils/identifier';
import { makeConversationLink } from 'common/utils/routerHelpers';
import useDefaultUrl from 'hooks/routing/useDefaultUrl';

import { useDataPersister, useDataProvider } from './dataHooks';

import { GroupChatNavLinkInterface } from '.';

export type GroupChatNavLinkHookInterface = {
  projectId: Id;
  onHideConversation: MouseEventHandler<HTMLDivElement>;
  onClick: () => void;
  innerRef: RefObject<HTMLAnchorElement>;
};

export default function useComponent(props: GroupChatNavLinkInterface): GroupChatNavLinkHookInterface {
  const history = useHistory();
  const dataPersister = useDataPersister(props.conversationId);

  const { projectId } = useDataProvider(props.conversationId);

  const prevIsSelected = usePrevious(props.isSelected);

  const innerRef = useRef();
  const defaultUrl = useDefaultUrl();

  const onClick = useCallback(() => {
    if (!props.isSelected) {
      history.push(makeConversationLink(props.conversationId));
    }
  }, [props.conversationId, history, props.isSelected]);

  const onHideConversation = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      dataPersister.onHideConversation();
      if (props.isSelected) {
        history.push(defaultUrl);
      }
    },
    [dataPersister.onHideConversation, props.isSelected, defaultUrl, history]
  );

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
    projectId,
    onHideConversation,
    onClick,
    innerRef,
  };
}

import { RefObject, useEffect, useRef } from 'react';

import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import { selectIsChatMuted } from 'models/domain/NotificationsModel/selectors';
import { selectProjectHasUnreadMessages } from 'models/domain/ProjectsModel/selectors';
import { useSelector } from 'react-redux';

import getSpaceUrl from '../../../../utils/getSpaceUrl';

import { SpaceNavLinkInterface } from '.';

export type SpaceNavLinkHookInterface = {
  isMuted: boolean;
  projectHasUnreadMessages: boolean;
  url: string;
  innerRef: RefObject<HTMLAnchorElement>;
};

export function useComponent(props: SpaceNavLinkInterface): SpaceNavLinkHookInterface {
  const { spaceId } = props;
  const isMuted = useSelector((state) => selectIsChatMuted(state, { objectId: spaceId }));
  const projectHasUnreadMessages = useSelector((state) =>
    selectProjectHasUnreadMessages(state, { projectId: spaceId }),
  );

  const innerRef = useRef();

  useEffect(() => {
    if (props.isSelected && innerRef.current) {
      scrollIntoViewIfNeeded(innerRef.current, {
        block: 'nearest',
        behavior: 'smooth',
        scrollMode: 'if-needed',
      });
    }
  }, [props.isSelected]);

  const url = getSpaceUrl(spaceId);

  return {
    isMuted,
    projectHasUnreadMessages,
    innerRef,
    url,
  };
}

import { RefObject, useRef } from 'react';

import { useSelector } from 'react-redux';

import { selectProjectUnreadMessagesCount } from '../../../../common/models/domain/NotificationsModel/selectors';

import { DataProviderHookInterface } from './dataHooks';
import { useBadgeRefEffect } from './useBadgeRefEffect';

import { BadgeInterface } from './index';

export function useDataProvider(props: BadgeInterface): DataProviderHookInterface {
  const counter = useSelector((state) => selectProjectUnreadMessagesCount(state, { projectId: props.objectId }));

  const innerRef: RefObject<HTMLDivElement> = useRef();

  useBadgeRefEffect({
    objectId: props.objectId,
    counter,
    innerRef,
  });

  return {
    counter,
    innerRef,
  };
}

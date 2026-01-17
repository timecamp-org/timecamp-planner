/* eslint-disable no-unused-expressions */
// @ts-nocheck
import React, {
  createContext,
  LegacyRef,
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { List } from 'immutable';
import { delay } from 'lodash';
import throttle from 'lodash/throttle';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import usePrevious from 'common/hooks/usePrevious';
import { useSelector } from 'common/hooks/useSelector';
import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { BadgeComponentRefRemover, BadgeComponentRefSetter, BadgeContainerType } from 'commonComponents/Badge/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

import { BadgeRefInterface } from '../MainMenu/hook';

const emptyList = List();

export type LeftMenuUnreadsContextInterface = {
  hiddenTopBadge: BadgeRefInterface;
  hiddenBottomBadge: BadgeRefInterface;
  onSetBadgeComponentRef: BadgeComponentRefSetter;
  onRemoveBadgeRefFromUnreadList: BadgeComponentRefRemover;
  onScrollNavList: MouseEventHandler<HTMLDivElement>;
  onSetNavListRef: LegacyRef<HTMLDivElement>;
  setOnOpenChatsAccordion: (onOpen: () => void) => void;
  setOnOpenProjectsAccordion: (onOpen: () => void) => void;
};

export const LeftMenuUnreadsContext = createContext<LeftMenuUnreadsContextInterface>({
  hiddenTopBadge: null,
  hiddenBottomBadge: null,
  onSetBadgeComponentRef: doNothing,
  onRemoveBadgeRefFromUnreadList: doNothing,
  onScrollNavList: doNothing,
  onSetNavListRef: doNothing,
  setOnOpenChatsAccordion: (onOpen: () => void) => {},
  setOnOpenProjectsAccordion: (onOpen: () => void) => {},
});

export const LeftMenuUnreadsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const badgesWithUnreadNotifications = useRef(emptyList as List<BadgeRefInterface>);
  const throttledCheckAllHiddenBadgesVisibility = useRef(null);

  const [hiddenTopBadge, onSetHiddenTopBadge] = useState<BadgeRefInterface>();
  const [hiddenBottomBadge, onSetHiddenBottomBadge] = useState<BadgeRefInterface>();
  const [navListRef, onSetNavListRef] = useState<HTMLDivElement>(null);
  const organizationId = useSelector(selectCurrentOrganizationId);
  const prevOrganizationId = usePrevious(organizationId);

  const onOpenProjectsAccordion = useRef<() => void | null>();
  const onOpenChatsAccordion = useRef<() => void | null>();
  const setOnOpenChatsAccordion = (cl: () => void) => {
    onOpenChatsAccordion.current = cl;
  };
  const setOnOpenProjectsAccordion = (cl: () => void) => {
    onOpenProjectsAccordion.current = cl;
  };

  const openAccordions = () => {
    onOpenProjectsAccordion.current?.();
    onOpenChatsAccordion.current?.();
  };

  const setHiddenBottomBadge = useCallback(
    (objectId: Id, badgeComponentRef: HTMLDivElement, objectType: BadgeContainerType) => {
      const scrollTargetNode = (
        objectType === BadgeContainerType.SPACE ? badgeComponentRef.parentNode.parentNode : badgeComponentRef.parentNode
      ) as Element;
      const badge: BadgeRefInterface = {
        objectId,
        objectType,
        badgeComponentRef,
        onClick: () => {
          openAccordions();
          delay(
            () =>
              scrollIntoViewIfNeeded(scrollTargetNode, {
                boundary: navListRef,
                block: 'end',
                duration: 300,
                behavior: 'smooth',
                scrollMode: 'if-needed',
              }),
            200,
          );
        },
      };
      onSetHiddenBottomBadge(badge);
    },
    [onSetHiddenBottomBadge, navListRef],
  );

  const setHiddenTopBadge = useCallback(
    (objectId: Id, badgeComponentRef: HTMLDivElement, objectType: BadgeContainerType) => {
      const scrollTargetNode =
        objectType === BadgeContainerType.SPACE
          ? badgeComponentRef.parentNode.parentNode
          : badgeComponentRef.parentNode;
      const badge: BadgeRefInterface = {
        objectId,
        objectType,
        badgeComponentRef,
        onClick: () => {
          openAccordions();
          // @ts-ignore
          delay(
            () =>
              scrollIntoViewIfNeeded(scrollTargetNode, {
                boundary: navListRef,
                block: 'start',
                duration: 300,
                behavior: 'smooth',
                scrollMode: 'if-needed',
              }),
            200,
          );
        },
      };
      onSetHiddenTopBadge(badge);
    },
    [navListRef],
  );
  const checkBadgeVisibility = useCallback(
    (savedBadgeRefObject: BadgeRefInterface) => {
      let containerTop = 85;
      let containerHeight;
      if (navListRef) {
        const clientRect = navListRef.getBoundingClientRect();
        containerTop = clientRect.top;
        containerHeight = clientRect.height;
      } else {
        containerHeight = window.innerHeight;
      }

      const { top, height } = savedBadgeRefObject.badgeComponentRef.getBoundingClientRect();

      const isBadgeHiddenToTop = top + height <= containerTop;
      const isBadgeHiddenFromBottom = top - containerTop >= containerHeight;

      if (isBadgeHiddenFromBottom) {
        if (hiddenBottomBadge) {
          const { top: currentHiddenBottomBadgeTop } = hiddenBottomBadge.badgeComponentRef.getBoundingClientRect();
          if (currentHiddenBottomBadgeTop < top) {
            setHiddenBottomBadge(
              savedBadgeRefObject.objectId,
              savedBadgeRefObject.badgeComponentRef,
              savedBadgeRefObject.objectType,
            );
          } else {
            // ok
          }
        } else {
          setHiddenBottomBadge(
            savedBadgeRefObject.objectId,
            savedBadgeRefObject.badgeComponentRef,
            savedBadgeRefObject.objectType,
          );
        }
      } else if (isBadgeHiddenToTop) {
        if (hiddenTopBadge) {
          const { top: currentHiddenTopBadgeTop } = hiddenTopBadge.badgeComponentRef.getBoundingClientRect();
          if (currentHiddenTopBadgeTop > top) {
            setHiddenTopBadge(
              savedBadgeRefObject.objectId,
              savedBadgeRefObject.badgeComponentRef,
              savedBadgeRefObject.objectType,
            );
          } else {
            // ok
          }
        } else {
          setHiddenTopBadge(
            savedBadgeRefObject.objectId,
            savedBadgeRefObject.badgeComponentRef,
            savedBadgeRefObject.objectType,
          );
        }
      } else {
        if (hiddenBottomBadge?.objectId === savedBadgeRefObject.objectId) {
          onSetHiddenBottomBadge(null);

          return;
        }
        if (hiddenTopBadge?.objectId === savedBadgeRefObject.objectId) {
          onSetHiddenTopBadge(null);
        }
      }
    },
    [
      setHiddenBottomBadge,
      setHiddenTopBadge,
      onSetHiddenBottomBadge,
      onSetHiddenTopBadge,
      hiddenTopBadge,
      hiddenBottomBadge,
      navListRef,
    ],
  );

  const onSetBadgeComponentRef = useCallback(
    (objectId: Id, notificationsCount: number, badgeComponentRef: HTMLDivElement, objectType: BadgeContainerType) => {
      const savedBadgeIndex = badgesWithUnreadNotifications.current.findIndex(
        (badgeRefObj) => badgeRefObj.objectId === objectId,
      );
      if (notificationsCount > 0) {
        if (badgeComponentRef) {
          const badgeRefObj: BadgeRefInterface = {
            objectId,
            badgeComponentRef,
            objectType,
          };
          if (savedBadgeIndex > -1) {
            badgesWithUnreadNotifications.current = badgesWithUnreadNotifications.current.set(
              savedBadgeIndex,
              badgeRefObj,
            );
          } else {
            badgesWithUnreadNotifications.current = badgesWithUnreadNotifications.current.push(badgeRefObj);
          }
          checkBadgeVisibility(badgeRefObj);
        }
      } else if (savedBadgeIndex > -1) {
        badgesWithUnreadNotifications.current = badgesWithUnreadNotifications.current.remove(savedBadgeIndex);
      } else {
        // ok
      }
    },
    [checkBadgeVisibility],
  );

  const onRemoveBadgeRefFromUnreadList = useCallback(
    (objectId: Id) => {
      badgesWithUnreadNotifications.current = badgesWithUnreadNotifications.current.filterNot(
        (savedBadgeRefObj) => savedBadgeRefObj.objectId === objectId,
      ) as List<BadgeRefInterface>;

      if (hiddenBottomBadge?.objectId === objectId) {
        onSetHiddenBottomBadge(null);
      } else if (hiddenTopBadge?.objectId === objectId) {
        onSetHiddenTopBadge(null);
      } else {
        // ok
      }
    },
    [hiddenBottomBadge?.objectId, hiddenTopBadge?.objectId],
  );

  const checBadgeVisibilityRef = useRef(checkBadgeVisibility);
  checBadgeVisibilityRef.current = checkBadgeVisibility;

  const checkAllHiddenBadgesVisibility = useCallback(() => {
    badgesWithUnreadNotifications.current.forEach(checBadgeVisibilityRef.current);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', throttledCheckAllHiddenBadgesVisibility.current);

    return () => window.removeEventListener('resize', throttledCheckAllHiddenBadgesVisibility.current);
  }, []);

  useEffect(() => {
    if (organizationId !== prevOrganizationId) {
      onSetHiddenBottomBadge(null);
      onSetHiddenTopBadge(null);
    }
  }, [organizationId, prevOrganizationId, checkAllHiddenBadgesVisibility]);

  const onScrollNavList = useCallback(() => {
    if (throttledCheckAllHiddenBadgesVisibility.current) {
      throttledCheckAllHiddenBadgesVisibility.current();
    } else {
      throttledCheckAllHiddenBadgesVisibility.current = throttle(checkAllHiddenBadgesVisibility, 100);
    }
  }, [checkAllHiddenBadgesVisibility]);

  const value: LeftMenuUnreadsContextInterface = useMemo(
    () => ({
      hiddenTopBadge,
      hiddenBottomBadge,
      onSetBadgeComponentRef,
      onRemoveBadgeRefFromUnreadList,
      onScrollNavList,
      onSetNavListRef,
      setOnOpenProjectsAccordion,
      setOnOpenChatsAccordion,
    }),
    [
      hiddenTopBadge,
      hiddenBottomBadge,
      onSetBadgeComponentRef,
      onRemoveBadgeRefFromUnreadList,
      onScrollNavList,
      onSetNavListRef,
      setOnOpenProjectsAccordion,
      setOnOpenChatsAccordion,
    ],
  );

  return <LeftMenuUnreadsContext.Provider value={value}>{children}</LeftMenuUnreadsContext.Provider>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useLeftMenuUnreadsContext = () => useContext(LeftMenuUnreadsContext);

import { useEffect, useRef } from 'react';

import IdleJs from 'idle-js';
import { useDispatch } from 'react-redux';

import usePrevious from 'common/hooks/usePrevious';
import { useSelector } from 'common/hooks/useSelector';
import { PushNotificationsClient } from 'common/services';
import { i18n } from 'i18n';
import * as AppModelActions from 'models/domain/AppModel/actions';
import * as AppModelSelectors from 'models/domain/AppModel/selectors';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import { selectCurrentUserLocale } from 'models/domain/UsersModel/selectors/domain';
import { isEmbedded as getIsEmbedded } from 'utils/isEmbedded';

interface UseAppInterface {
  hasLoaded: boolean;
}

export const useComponent = (): UseAppInterface => {
  const hasLoaded = useSelector(AppModelSelectors.hasLoaded);
  const hasLoadedPrev = usePrevious(hasLoaded);
  const userLocale = useSelector(selectCurrentUserLocale);
  const userLocalePrev = usePrevious(userLocale);
  const isUserIdle = useSelector(AppModelSelectors.selectIsUserIdle);
  const idleListener = useRef();
  const isUserIdleRef = useRef<boolean>(isUserIdle);

  isUserIdleRef.current = isUserIdle;

  const dispatch = useDispatch();

  const onInit = (initCoreApp: boolean) =>
    dispatch(AppModelActions.onInit(initCoreApp));
  const onSetIsEmbedded = (isEmbedded: boolean) =>
    dispatch(AppModelActions.onSetIsEmbedded(isEmbedded));
  const onSetCurrentDeviceId = (deviceId: string) =>
    dispatch(NotificationsModelActions.onSetCurrentDeviceId(deviceId));
  const onUnmutePushNotifications = () =>
    dispatch(NotificationsModelActions.onUnmutePushNotifications());
  const onSetIsUserIdle = (isIdle: boolean) =>
    dispatch(AppModelActions.onSetIsUserIdle(isIdle));
  const onSetIsPageVisible = (isVisible: boolean) =>
    dispatch(AppModelActions.onSetIsPageVisible(isVisible));

  const onNotificationsSubscriptionChange = (newToken: string) => {
    if (newToken) {
      onUnmutePushNotifications();
    } else {
      onSetCurrentDeviceId(null);
    }
  };

  const onSetUserIsIdle = () => {
    if (!isUserIdleRef.current) {
      onSetIsUserIdle(true);
    }
  };

  const onSetUserIsActive = () => {
    if (isUserIdleRef.current) {
      onSetIsUserIdle(false);
    }
  };

  useEffect(() => {
    const initCoreApp = window.location.pathname.includes('/oauth/authorize');
    if (!hasLoaded) {
      onInit(initCoreApp);
    }

    idleListener.current = new IdleJs({
      idle: 10 * 1000, // 10 seconds
      onIdle: onSetUserIsIdle,
      onActive: onSetUserIsActive,
      onHide: () => onSetIsPageVisible(false),
      onShow: () => onSetIsPageVisible(true),
    }).start();

    onSetIsEmbedded(getIsEmbedded());

    return () => {
      idleListener.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPrev && hasLoaded) {
      PushNotificationsClient.onTokenRefresh(onNotificationsSubscriptionChange);
      const appLoadedEvent = new Event('appLoaded');
      document.dispatchEvent(appLoadedEvent);
    } else if (!hasLoaded) {
      const appLoadingEvent = new Event('appLoading');
      document.dispatchEvent(appLoadingEvent);
    }
    if (userLocalePrev !== userLocale) {
      i18n.changeLanguage(userLocale);
    }
  }, [
    hasLoadedPrev,
    hasLoaded,
    userLocalePrev,
    userLocale,
    onNotificationsSubscriptionChange,
  ]);

  return {
    hasLoaded,
  };
};

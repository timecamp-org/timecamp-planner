import { useState, KeyboardEvent } from 'react';

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { useSelector, useDispatch } from 'react-redux';

import { HeySpaceClient as client } from 'common/services';
import { Id } from 'common/utils/identifier';
import { isTestEnabledForOrganization } from 'models/component/ABTestsModel';
import { TestType } from 'models/component/ABTestsModel/types';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import {
  selectEnablePushNotifications,
  selectEnableEmailNotifications,
  selectEnableSoundNotifications,
} from 'models/domain/NotificationsModel/selectors/domain';
import { NotificationMethod } from 'models/domain/NotificationsModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { getNotificationsSettings } from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import { UserInOrganizationSettingsType } from 'models/domain/SettingsModel/types';

import { useGetUserInOrganizationSettings } from './useGetUserInOrganizationSettings';
import { useUpdateUserInOrganizationSettings } from './useUpdateUserInOrganizationSettings';

interface UserInOrganizationSettingsInterface {
  createdAt: number;
  id: Id;
  settingsType: UserInOrganizationSettingsType;
  typeId: Id;
  userInOrganizationId: Id;
  value: {
    visibleChatsCount?: number;
    chatsExpirationPeriod?: number;
  };
}

interface UserInOrganizationSettingsResponse {
  settings: UserInOrganizationSettingsInterface;
}

const QUERY_ID = 'settings-chats-retention';
const DEFAULT_VISIBLE_CHATS_COUNT = 20;
const DEFAULT_CHATS_EXPIRATION_PERIOD = 7;

export interface UsePreferencesInterface {
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSoundNotifications: boolean;
  isNotificationsSettingsLoading: boolean;
  visibleChatsCount: number;
  chatsExpirationPeriod: number;
  onSwitchBrowserNotifications: VoidFunction;
  onSwitchEmailNotifications: VoidFunction;
  onSwitchSoundNotifications: VoidFunction;
  onBlur: VoidFunction;
  onSetVisibleChatsCount: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSetChatsExpirationPeriod: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export const useComponent = (): UsePreferencesInterface => {
  const enablePushNotifications = useSelector(selectEnablePushNotifications);
  const enableEmailNotifications = useSelector(selectEnableEmailNotifications);
  const enableSoundNotifications = useSelector(selectEnableSoundNotifications);
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const isNotificationsSettingsLoading = useSelector((state) =>
    selectRequestIsLoading(state, {
      requestType: getNotificationsSettings,
      objectId: currentOrganizationId,
    })
  );

  const [visibleChatsCountLocal, onSetVisibleChatsCountLocal] = useState(
    DEFAULT_VISIBLE_CHATS_COUNT
  );
  const [chatsExpirationPeriodLocal, onSetChatsExpirationPeriodLocal] =
    useState(DEFAULT_CHATS_EXPIRATION_PERIOD);

  const dispatch = useDispatch();

  const onUpdateNotificationSettings = (
    notificationMethod: NotificationMethod,
    isEnabled: boolean
  ) =>
    dispatch(
      NotificationsModelActions.onUpdateNotificationSettings(
        notificationMethod,
        isEnabled
      )
    );

  const onSwitchBrowserNotifications = () => {
    onUpdateNotificationSettings(
      NotificationMethod.PUSH,
      !enablePushNotifications
    );
  };

  const onSwitchEmailNotifications = () => {
    onUpdateNotificationSettings(
      NotificationMethod.EMAIL,
      !enableEmailNotifications
    );
  };

  const onSwitchSoundNotifications = () => {
    onUpdateNotificationSettings(
      NotificationMethod.SOUND,
      !enableSoundNotifications
    );
  };

  useGetUserInOrganizationSettings({
    queryId: QUERY_ID,
    settingsType: UserInOrganizationSettingsType.CHATS_RETENTION,
    onSuccess: (data: UserInOrganizationSettingsResponse) => {
      const { chatsExpirationPeriod, visibleChatsCount } = data?.settings
        ?.value || {
        chatsExpirationPeriod: DEFAULT_CHATS_EXPIRATION_PERIOD,
        visibleChatsCount: DEFAULT_VISIBLE_CHATS_COUNT,
      };
      onSetVisibleChatsCountLocal(visibleChatsCount);
      onSetChatsExpirationPeriodLocal(chatsExpirationPeriod);
    },
  });

  const { onSave } = useUpdateUserInOrganizationSettings({
    queryId: QUERY_ID,
    settingsType: UserInOrganizationSettingsType.CHATS_RETENTION,
  });

  const onBlur = () => {
    onSave({
      visibleChatsCount: visibleChatsCountLocal,
      chatsExpirationPeriod: chatsExpirationPeriodLocal,
    });
  };

  const onSetVisibleChatsCount = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value) {
      return;
    }
    onSetVisibleChatsCountLocal(parseInt(event.currentTarget.value));
  };

  const onSetChatsExpirationPeriod = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (!event.currentTarget.value) {
      return;
    }
    onSetChatsExpirationPeriodLocal(parseInt(event.currentTarget.value));
  };

  return {
    enablePushNotifications,
    enableEmailNotifications,
    enableSoundNotifications,
    isNotificationsSettingsLoading,
    visibleChatsCount: visibleChatsCountLocal,
    chatsExpirationPeriod: chatsExpirationPeriodLocal,
    onSwitchBrowserNotifications,
    onSwitchEmailNotifications,
    onSwitchSoundNotifications,
    onSetVisibleChatsCount,
    onSetChatsExpirationPeriod,
    onBlur,
  };
};

/* eslint-disable @typescript-eslint/naming-convention */
import { useDispatch, useSelector } from 'react-redux';

import { Check } from 'commonComponents/Icons/fontawesome/Check';
import { FaceSmile } from 'commonComponents/Icons/fontawesome/FaceSmile';
import { LocationDot } from 'commonComponents/Icons/fontawesome/LocationDot';
import { PresentationScreen } from 'commonComponents/Icons/fontawesome/PresentationScreen';
import { Puzzle } from 'commonComponents/Icons/fontawesome/Puzzle';
import { UserGear } from 'commonComponents/Icons/fontawesome/UserGear';
import { UserPlus } from 'commonComponents/Icons/fontawesome/UserPlus';
import useCalendlyComponent from 'components/menu/DemoButton/hook';
import { useTranslation } from 'i18n';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { selectIsWorkspacesPanelVisible } from 'models/domain/AppModel/selectors';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';

import UserDropdownChatItem from './components/UserDropdownChatItem';
import UserDropdownDividerItem from './components/UserDropdownDividerItem';
import UserDropdownEmptyItem from './components/UserDropdownEmptyItem';
import { getUserDropdownItem } from './components/UserDropdownItem';
import UserDropdownLogoutItem from './components/UserDropdownLogoutItem';
import UserDropdownMailToItem from './components/UserDropdownMailToItem';
import { UserDropdownItemProps } from './types';

type UserDropdownItemData = {
  Component: React.FC<any>;
  props?: Omit<UserDropdownItemProps, 'Icon'>;
};

type UserDropdownItemDataArray = UserDropdownItemData[];

export const useCurrentUserDropdownMenuItems = (): UserDropdownItemDataArray => {
  const isWorkspacesPanelVisible = useSelector(selectIsWorkspacesPanelVisible);
  const isGuest = useSelector(selectIsCurrentUserOrganizationGuest);
  const shouldShowChatButton = true;

  const { onClick: openCalendly } = useCalendlyComponent();

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const dropdownItems: UserDropdownItemDataArray = [
    {
      Component: getUserDropdownItem(FaceSmile),
      props: {
        label: t('Set status'),
        onClick: () => dispatch(onOpenModal(ModalType.USER_STATUS_MODAL)),
      },
    },
    {
      Component: getUserDropdownItem(UserGear),
      props: {
        label: t('Edit profile'),
        url: '/settings/profile',
      },
    },
    {
      Component: getUserDropdownItem(Puzzle),
      props: {
        label: t('Integrations'),
        url: '/settings/addons',
      },
    },
    {
      Component: getUserDropdownItem(LocationDot),
      props: {
        label: t('Desktop & mobile apps'),
        url: 'https://www.timecamp.com/planner/apps/',
      },
    },
    {
      Component: getUserDropdownItem(isWorkspacesPanelVisible ? Check : null),
      props: {
        label: t('Show workspace list'),
        onClick: (e) => {
          dispatch(AppModelActions.onSetIsWorkspacesPanelVisible(!isWorkspacesPanelVisible));
          e.stopPropagation();
        },
      },
    },
    {
      Component: UserDropdownEmptyItem,
    },
    {
      Component: getUserDropdownItem(UserPlus),
      props: {
        label: t('Invite people'),
        onClick: () => dispatch(onOpenModal(ModalType.INVITE_PEOPLE_MODAL)),
        isDisabled: isGuest,
      },
    },
    {
      Component: UserDropdownMailToItem,
    },
    { Component: shouldShowChatButton ? UserDropdownChatItem : () => <></> },
    {
      Component: getUserDropdownItem(PresentationScreen),
      props: {
        label: t('Schedule a Demo'),
        onClick: openCalendly,
      },
    },
    {
      Component: UserDropdownDividerItem,
    },
    {
      Component: UserDropdownLogoutItem,
    },
  ];

  return dropdownItems;
};

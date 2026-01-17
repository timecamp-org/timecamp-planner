import styled from 'styles/styled';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Folders } from 'commonComponents/Icons/fontawesome/Folders';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import CreateGroupButton from 'components/menu/spaces/CreateGroupButton';
import SpaceGroups from 'components/menu/spaces/SpaceGroups';
import SpaceListHeader from 'components/menu/spaces/SpaceListHeader';
import SpaceNavLinkList from 'components/menu/spaces/SpaceNavLinkList';
import UngroupedSpaceNavLinks from 'components/menu/spaces/UngroupedSpaceNavLinks';
import { useTranslation } from 'i18n';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { selectAllVisibleSpacesUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';

import { NotificationIndicator, RelativeActionButton, StyledActionButton } from './Styled';
import { TemporaryDrawer, TemporaryDrawerHeader } from './TemporaryDrawer';

const StyledButton = styled(StyledActionButton)`
  padding-left: 1rem !important;
  margin-left: -1rem;
`;

export const ProjectButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hasNotification = !!useSelector(selectAllVisibleSpacesUnreadMessagesCount);

  const hasAccessToProjectGroups = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.SPACE_GROUPS,
    }),
  );

  const onClick = () => dispatch(onOpenModal(ModalType.ADD_NEW_PROJECT_MODAL));

  return (
    <TemporaryDrawer
      id="projects"
      anchorRenderer={({ isOpen, toggleOpen }) => (
        <RelativeActionButton onClick={toggleOpen} isActive={isOpen} isCollapsed>
          <Folders />
          {hasNotification && <NotificationIndicator />}
        </RelativeActionButton>
      )}
    >
      <TemporaryDrawerHeader>{t('PROJECTS')}</TemporaryDrawerHeader>
      <StyledButton onClick={onClick}>
        <Plus />
        <span>{t('Create project')}</span>
      </StyledButton>
      <SpaceListHeader />
      {hasAccessToProjectGroups ? (
        <>
          <CreateGroupButton />
          <SpaceGroups />
          <UngroupedSpaceNavLinks />
        </>
      ) : (
        <SpaceNavLinkList />
      )}
    </TemporaryDrawer>
  );
};

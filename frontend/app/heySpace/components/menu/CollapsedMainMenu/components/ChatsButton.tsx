import { useSelector } from 'react-redux';

import { Message } from 'commonComponents/Icons/fontawesome/Message';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import TeamMenuModal from 'components/menu/team/TeamMenuModal';
import UserNavLinkList from 'components/menu/team/UserNavLinkList';
import { useTranslation } from 'i18n';
import { selectAllVisibleSpacesUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors';

import { NotificationIndicator, RelativeActionButton, StyledActionButton } from './Styled';
import { TemporaryDrawer, TemporaryDrawerHeader } from './TemporaryDrawer';

export const ChatsButton = () => {
    const { t } = useTranslation();

    const hasNotification = !!useSelector(selectAllVisibleSpacesUnreadMessagesCount);

    return (
        <TemporaryDrawer
            id="chats"
            anchorRenderer={({ isOpen, toggleOpen }) => (
                <RelativeActionButton onClick={toggleOpen} isActive={isOpen} isCollapsed>
                    <Message />
                    {hasNotification && <NotificationIndicator />}
                </RelativeActionButton>
            )}
        >
            <TemporaryDrawerHeader>{t('CHATS')}</TemporaryDrawerHeader>

            <TeamMenuModal>
                <StyledActionButton>
                    <Plus color="var(--color-gray-900)" />
                    <span>{t('Create chat')}</span>
                </StyledActionButton>
            </TeamMenuModal>

            <UserNavLinkList />
        </TemporaryDrawer>
    );
};

import { useEffect, useRef } from 'react';

import styled from 'styles/styled';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import Badge from 'commonComponents/Badge';
import { BadgeNotificationType } from 'commonComponents/Badge/types';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import TeamMenuModal from 'components/menu/team/TeamMenuModal';
import { useTranslation } from 'i18n';
import { selectTotalConversationsMessagesCount } from 'models/domain/NotificationsModel/selectors';

import { Accordion } from '../../../common/Accordion/Accordion';
import { useLeftMenuUnreadsContext } from '../../LeftMenuUnreadsController/context';
import UserNavLinkList from '../../team/UserNavLinkList/index';

import { TextUnderlined } from './styled';

const StyledAccordion = styled(Accordion)`
  .MuiAccordionDetails-root {
    padding-left: 0;
  }
`;

export const ChatsSection = () => {
  const [expanded, setExpanded] = useLocalStorage('isChatsSectionExpanded', false);
  const { t } = useTranslation();
  const notificationCountRef = useRef(0);
  const { setOnOpenChatsAccordion } = useLeftMenuUnreadsContext();
  const unreadTotalMessageCount = useSelector(selectTotalConversationsMessagesCount);
  notificationCountRef.current = unreadTotalMessageCount;

  const onChange = (isExpanded: boolean) => setExpanded(isExpanded);

  useEffect(() => {
    setOnOpenChatsAccordion(() => {
      if (notificationCountRef.current) {
        setExpanded(true);
      }
    });
  }, [setOnOpenChatsAccordion, setExpanded, notificationCountRef]);

  return (
    <StyledAccordion
      header={<TextUnderlined $isUnderlined={!!unreadTotalMessageCount}>{t('Chats')}</TextUnderlined>}
      expanded={expanded}
      onChange={onChange}
      rightIcon={
        <>
          <Badge objectType={BadgeNotificationType.STANDALONE} counter={unreadTotalMessageCount} />
          <TeamMenuModal>
            <IconButton>
              <Plus size="lg" color="var(--color-gray-900)" />
            </IconButton>
          </TeamMenuModal>
        </>
      }
    >
      <UserNavLinkList />
    </StyledAccordion>
  );
};

import { FC } from 'react';

import { Button } from '@mui/material';
import { List } from 'immutable';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ellipsizeInTheEnd } from 'common/utils';
import { generateConversationId } from 'common/utils/generateCombinedId';
import { Id } from 'common/utils/identifier';
import { makeConversationLink } from 'common/utils/routerHelpers';
import { useOnCloseSearchModal } from 'commonComponents/GlobalSearch/hooks/useOnCloseSearchModal';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import PersonIcon from 'components/person/PersonIcon';
import { useTranslation } from 'i18n';
import { EntityStatus } from 'models/domain/EntityModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { ItemLayout } from './ItemLayout';

export interface PersonItemInterface {
  id: Id;
  firstName: string;
  lastName: string;
  status: EntityStatus;
  email: string;
  avatarUrl?: string;
  nickname?: string;
}

export const PersonItem: FC<PersonItemInterface> = ({ id, firstName, lastName, email, nickname }) => {
  const { t } = useTranslation();
  const onCloseSearchModal = useOnCloseSearchModal();
  const currentUserId = useSelector(selectCurrentUserId);
  const organizationId = useSelector(selectCurrentOrganizationId);
  const conversationPeople = List([currentUserId, id]);
  const conversationId = generateConversationId(conversationPeople, organizationId);

  return (
    <ItemLayout
      img={<PersonIcon userId={id} />}
      title={`${firstName} ${lastName}`}
      subtitle={
        <>
          <TooltipedHoveredComponent message={email}>{ellipsizeInTheEnd(email, 25)}</TooltipedHoveredComponent>
          {`${nickname ? ` • @${nickname}` : ''}`}
        </>
      }
      actionButtons={
        <Link to={makeConversationLink(conversationId)} onClick={onCloseSearchModal}>
          <Button>{t('Chat')}</Button>
        </Link>
      }
    />
  );
};

import { FC } from 'react';

import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import { ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';
import {
  selectIsUserActiveInCurrentOrganization,
  selectIsUserOrganizationGuest,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { selectUserStatusTitle } from 'models/domain/UserStatusModel/selectors/domain';

import { useTranslation } from '../../../../../common/i18n/index';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.2rem;
  color: var(--color-gray-500);
  font-size: var(--fontSize-xxs);
  font-weight: var(--fontWeight-regular);
  overflow: hidden;
  line-height: 1;
`;

const StatusLine = styled.div`
  color: var(--color-primary-900);
  font-size: var(--fontSize-sm);
`;

interface UserButtonLabelInterface {
  userId: Id;
  statusMaxLength?: number;
  className?: string;
}

export const UserButtonLabel: FC<UserButtonLabelInterface> = ({ userId, statusMaxLength = 35, className }) => {
  const { t } = useTranslation();
  const isGuest = useSelector((state) =>
    selectIsUserOrganizationGuest(state, {
      userId,
    })
  );

  const isDisabled = !useSelector((state) =>
    selectIsUserActiveInCurrentOrganization(state, {
      userId,
    })
  );

  const status = useSelector((state) =>
    selectUserStatusTitle(state, {
      userId,
    })
  );

  return (
    <Wrapper className={className}>
      {status && <StatusLine>{ellipsizeInTheEnd(status, statusMaxLength)}</StatusLine>}
      {isDisabled && <div>{t('(Disabled)')}</div>}
      {isGuest && <div>{t('Guest')}</div>}
    </Wrapper>
  );
};

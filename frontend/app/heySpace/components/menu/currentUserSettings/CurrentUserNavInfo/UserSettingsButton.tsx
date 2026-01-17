import { FC } from 'react';

import { Box, Button } from '@mui/material';

import UserStatusEmoji from 'commonComponents/UserStatusEmoji';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import styled from 'styles/styled';
import { ellipsisLongText } from 'styles/utils';

import styles from './styles.css';
import { UserButtonLabel } from './UserButtonLabel';

// eslint-disable-next-line prettier/prettier
const StyledButton = styled(Button)<{ $isActive: boolean }>`
  border-radius: 99rem;
  min-width: unset;
  max-width: 24rem;
  width: 100%;
  background-color: ${({ $isActive }) => ($isActive ? 'var(--color-primary-200)' : 'var(--color-primary-50)')};
  padding: 0.5rem 0.8rem;
  overflow: hidden;
  margin-top: 1.2rem;
  text-transform: none;
  color: var(--color-gray-900);
  display: flex;
  justify-content: flex-start;

  &:hover {
    background-color: var(--color-primary-100);
  }

  :focus {
    background-color: var(--color-primary-200);
  }
`;

const DetailsWrapper = styled(Box)`
  min-height: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  align-items: flex-start;
  text-align: start;
  margin-left: 0.8rem;
  padding: 0;
`;

const DescriptionLineWrapper = styled(Box)`
  gap: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: last baseline;
`;

const StyledUserStatusEmoji = styled(UserStatusEmoji)`
  margin-left: auto;
  display: flex;
`;

const StyledPersonFullName = styled(PersonFullName)`
  ${ellipsisLongText}
  line-height: 1;
  overflow-y: hidden;
`;

interface UserSettingsButtonInterface {
  userId: string;
  onClick: () => void;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export const UserSettingsButton: FC<UserSettingsButtonInterface> = ({ userId, onClick, isActive, isCollapsed }) =>
  isCollapsed ? (
    <div onClick={onClick}>
      <PersonIcon
        userId={userId}
        showOnlineIndicator={false}
        onClick={onClick}
        wrapperClassName={styles.personIconWrapper}
      />
    </div>
  ) : (
    <StyledButton onClick={onClick} $isActive={isActive}>
      <PersonIcon
        userId={userId}
        showOnlineIndicator={false}
        onClick={onClick}
        wrapperClassName={styles.personIconWrapper}
      />
      <DetailsWrapper>
        <DescriptionLineWrapper>
          <StyledPersonFullName userId={userId} maxNameLength={15} />
          <StyledUserStatusEmoji
            userId={userId}
            // @ts-ignore
            size={16}
          />
        </DescriptionLineWrapper>
        <UserButtonLabel userId={userId} statusMaxLength={18} />
      </DetailsWrapper>
    </StyledButton>
  );

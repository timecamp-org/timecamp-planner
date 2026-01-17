import { FC } from 'react';

import styled from '@emotion/styled';

import { Id } from 'common/utils/identifier';
import DueDate from 'commonComponents/DueDate';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';

export interface MessageInterface {
  isContinuation: boolean;
  senderId: Id;
  timestamp: number;
  content: string;
}

const Layout = styled.div<{ isContinuation?: boolean }>`
  padding: 0.5rem 1rem;
  padding-top: 0;
  margin-top: ${({ isContinuation }) => (isContinuation ? '.2rem' : '1rem')};
  display: grid;
  grid-template-columns: 3rem auto;
  grid-column-gap: 1.5rem;
  align-items: center;
`;

const MessageDetails = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const NextMessage = styled.p`
  grid-column: 2;
`;

const StyledDate = styled(DueDate)`
  padding: 0;
  color: var(--color-gray-500);
  font-size: var(--fontSize-xxs);
`;

const StyledPersonFullName = styled(PersonFullName)`
  font-weight: var(--fontWeight-semibold);
`;

export const Message: FC<MessageInterface> = ({ isContinuation, senderId, timestamp, content }) =>
  isContinuation ? (
    <Layout isContinuation>
      <NextMessage>{content}</NextMessage>
    </Layout>
  ) : (
    <>
      <Layout>
        <PersonIcon userId={senderId} />
        <MessageDetails>
          <StyledPersonFullName userId={senderId} />
          <StyledDate dueDate={timestamp} />
        </MessageDetails>
      </Layout>
      <Layout isContinuation>
        <NextMessage>{content}</NextMessage>
      </Layout>
    </>
  );

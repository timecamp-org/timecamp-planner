import styled from 'styles/styled';

import { SidebarActionButton } from 'components/buttons/SidebarActionButton';

export const NotificationIndicator = styled.div`
  position: absolute;
  background-color: var(--color-accent-500);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  left: 60%;
  bottom: 10%;
`;

export const RelativeActionButton = styled(SidebarActionButton)`
  position: relative;
`;

export const StyledActionButton = styled(SidebarActionButton)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: var(--fontWeight-regular);
  font-size: var(--fontSize-xs) !important;
  margin-top: 2rem;
  padding-left: 1.8rem !important;

  & > span {
    margin-left: 1.2rem;
  }
`;

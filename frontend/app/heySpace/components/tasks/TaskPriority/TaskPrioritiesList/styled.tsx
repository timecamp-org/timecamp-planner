import styled from 'styles/styled';
import { Button } from '@mui/material';

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & button {
    cursor: pointer;
    margin-left: 3rem;
  }
`;

export const TitleLabel = styled.span`
  margin-left: 1rem;
  font-weight: var(--fontWeight-semibold);
`;

export const TaskPriorityItemWrapper = styled.div`
  display: flex;
  padding: 0.7rem 1rem;
  gap: 1rem;
  cursor: pointer;
  align-items: center;
  &:hover {
    background: var(--color-gray-100);
    & button {
      visibility: visible;
    }
  }
`;

export const TaskPriorityItemButton = styled(Button)`
  padding: 0 2rem;
  margin-left: auto;
  visibility: hidden;
`;

export const TaskPriorityItemLabel = styled.span`
  text-transform: capitalize;
`;

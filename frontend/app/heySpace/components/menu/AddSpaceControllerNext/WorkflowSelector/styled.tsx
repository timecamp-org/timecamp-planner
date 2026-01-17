import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';

export const WorkflowButton = styled(ButtonBase)`
  height: 30rem;
  width: 20rem;
  display: flex;
  flex-flow: column;
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.07);
  border-radius: var(--borderRadius-sm);

  :hover {
    background-color: var(--color-gray-100);
  }
`;

export const ButtonTitle = styled.p`
  margin-top: 2.4rem;
  font-size: var(--fontSize-sm);
  font-weight: var(--fontWeight-semibold);
  line-height: 150%;
`;

export const ButtonSubTitle = styled.p`
  font-size: var(--fontSize-xs);
`;

export const ButtonBox = styled.div`
  margin-top: 3.2rem;
  display: flex;
  gap: 1.6rem;
  justify-content: center;
`;

export const Wrapper = styled.div`
  padding: 2.4rem;
  max-width: 50rem;
`;

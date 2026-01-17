import styled from 'styles/styled';

export const SubHeader = styled.p`
  margin-bottom: 2.4rem;
  padding: 0 0.8rem;
`;

export const Hint = styled.div`
  background-color: var(--color-primary-50);
  padding: 0.8rem 1.6rem;
`;

export const HintHeader = styled.p`
  font-weight: var(--fontWeight-semibold);
  margin-bottom: 0.5rem;
`;

export const List = styled.ol`
  margin-bottom: 3.2rem;
  line-height: 150%;
`;

export const Link = styled.a`
  text-decoration: underline;
  color: var(--color-primary-500);
`;

export const Info = styled.div`
  display: flex;
`;

export const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.8rem;

  & > *:last-child {
    margin-top: 0.4rem;
  }
`;

export const InputHeader = styled.p`
  font-weight: var(--fontWeight-semibold);
  margin-top: 2.4rem;
  margin-bottom: 0.4rem;
  padding: 0 0.8rem;
`;

import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';

export const Wrapper = styled.div`
  max-height: 56rem;
  height: 100vh;
  max-width: 100rem;
  width: 100vw;
  display: flex;
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 39rem;
  width: 100%;
  padding-top: 1.2rem;
  padding-bottom: 1.8rem;
  padding-left: 2rem;
`;

export const PreviewSection = styled.div`
  padding: 2.4rem;
  min-width: 59rem;
  width: 100%;
  background-color: var(--color-gray-100);
  display: flex;
  flex-direction: column;
`;

export const ListHeader = styled.p`
  margin-top: 1.8rem;
  margin-bottom: 3rem;
  font-size: var(--fontSize-base);
  font-weight: var(--fontWeight-semibold);
  text-align: center;
`;

export const ListTitle = styled.p`
  font-size: var(--fontSize-xxs);
  font-weight: var(--fontWeight-semibold);
  margin-top: 1rem;
`;

export const ListWrapper = styled.div`
  overflow-y: auto;
`;

export const PreviewHeader = styled.p`
  margin-bottom: 1.6rem;
  font-size: var(--fontSize-md);
  font-weight: var(--fontWeight-semibold);
`;

export const PreviewTitle = styled.p`
  font-size: var(--fontSize-sm);
  font-weight: var(--fontWeight-regular);
  margin-bottom: 1.5rem;
`;

export const BackButton = styled(ButtonBase)`
  padding: 1.2rem;
  width: 4rem;
  height: 4rem;
  border-radius: var(--borderRadius-sm);
`;

export const List = styled.ul`
  list-style: none;
  overflow-y: auto;
  padding-bottom: 1rem;
  flex-grow: 1;
  min-height: 0;

  & > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const TemplateSelectionFooter = styled.footer`
  margin-top: 2.4rem;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PreviewWrapper = styled.div`
  flex-grow: 1;
  min-height: 0;
  border-radius: var(--borderRadius-sm);
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

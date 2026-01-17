import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Text = styled.p`
  padding: 0 2.4rem;
  margin-bottom: 2.4rem;
  font-size: var(--fontSize-xs);
`;

export const Footer = styled.footer`
  padding: 2.4rem;
  padding-top: 1.6rem;
  margin-top: 0;
  display: flex;
  justify-content: space-between;
`;

export const modalBodyClass = css`
  padding: 0;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  font-size: var(--fontSize-xs);
`;

export const Label = styled.label`
  margin-left: 0;
  line-height: 1;
`;

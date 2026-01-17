import styled from '@emotion/styled';

import { useTranslation } from 'common/i18n';

const StyledFooter = styled.footer`
  background-color: var(--color-gray-50);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 2.4rem;
  margin-top: 0;
`;

const Text = styled.span`
  font-size: var(--fontSize-xxs);
`;

const KeyButton = styled.div`
  border: 1px solid var(--color-gray-400);
  border-radius: var(--borderRadius-sm);
  padding: 0.4rem 0.8rem;
  background-color: var(--color-white);
  color: var(--color-gray-700);
`;

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <Text>{t('To close - click ouside this box or press: ')}</Text>
      <KeyButton>{t('Esc')}</KeyButton>
    </StyledFooter>
  );
};

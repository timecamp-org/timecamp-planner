import { FC, ReactNode } from 'react';

import styled from '@emotion/styled';

import { useTranslation } from 'common/i18n';
import { BoxArchive } from 'commonComponents/Icons/fontawesome/BoxArchive';

export const BUTTONS_CLASS_NAME = 'buttons';

export const Item = styled.li`
  height: 5.6rem;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.8rem;
  padding: 1rem 1.6rem;

  :hover {
    background-color: var(--color-gray-100);
  }

  :hover > .${BUTTONS_CLASS_NAME} {
    visibility: visible;
  }
`;

export const ImgWrapper = styled.div`
  position: relative;
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ArchivedIcon = styled(BoxArchive)`
  position: absolute;
  top: 75%;
  left: 75%;
  transform: translate(-25%, -25%);
  background-color: var(--color-white);
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled.div<{ isArchived: boolean }>`
  font-weight: var(--fontWeight-semibold);
  font-size: var() (--fontSize-xs);
  ${({ isArchived }) => (isArchived ? 'color: var(--color-gray-500)' : '')}
`;

export const SubTitle = styled.div`
  color: var(--color-gray-500);
  font-size: var() (--fontSize-xs);
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
`;

export const ActionButtons = styled.div`
  visibility: hidden;
  position: absolute;
  top: 50%;
  right: 1.6rem;
  transform: translateY(-50%);
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;

export const ItemSubtitle: FC<{ isArchived: boolean; children?: ReactNode }> = ({ isArchived, children }) => {
  const { t } = useTranslation();

  return <SubTitle>{isArchived ? t('Archived') : children}</SubTitle>;
};

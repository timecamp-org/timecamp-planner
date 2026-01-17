import { FC } from 'react';

import styled from '@emotion/styled';

import { useTranslation } from 'common/i18n';
import { File } from 'commonComponents/Icons/fontawesome/File';
import { Folders } from 'commonComponents/Icons/fontawesome/Folders';
import { ListTree } from 'commonComponents/Icons/fontawesome/ListTree';
import { MessageLines } from 'commonComponents/Icons/fontawesome/MessageLines';
import { Search } from 'commonComponents/Icons/fontawesome/Search';
import { Users } from 'commonComponents/Icons/fontawesome/Users';

import { GlobalSearchResource } from '../types';

const Header = styled.h6`
  font-weight: var(--fontWeight-semibold);
  font-size: var(--fontSize-lg);
  margin-top: 2rem;
  margin-bottom: 0.8rem;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconPositionWrapper = styled.div`
  position: relative;
`;

const InnerIconWrapper = styled.div`
  position: absolute;
  top: 42%;
  left: 42%;
  transform: translate(-50%, -50%);
  color: var(--color-primary-500);

  & > svg {
    width: 3.5rem;
    height: 3.5rem;
  }
`;

const getResourceIcon = (resource: GlobalSearchResource) => {
  switch (resource) {
    case GlobalSearchResource.MESSAGE:
      return <MessageLines />;
    case GlobalSearchResource.TASK:
      return <ListTree />;
    case GlobalSearchResource.PROJECT:
      return <Folders />;
    case GlobalSearchResource.FILE:
      return <File />;
    case GlobalSearchResource.USER:
      return <Users />;
    default:
      // eslint-disable-next-line no-unused-expressions
      null;
  }
};

export const NoResults: FC<{ resource: GlobalSearchResource; hasQuery: boolean }> = ({ resource, hasQuery }) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <IconPositionWrapper>
        <InnerIconWrapper>{getResourceIcon(resource)}</InnerIconWrapper>
        <Search size="6x" />
      </IconPositionWrapper>
      <Header>{t('NO RESULTS')}</Header>
      <p>{hasQuery ? t('Try different phrase') : t('Type your search phrase (min 3 letters)')}</p>
    </Wrapper>
  );
};

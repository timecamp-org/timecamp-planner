import React, { CSSProperties } from 'react';

import { Button } from '@mui/material';
import styled from 'styles/styled';
import { useTranslation } from 'i18n';
import { SpaceViewTypeTabItem } from '../SpaceViewHeader/SpaceViewHeader';
import { useComponent } from './hook';

export type SpaceViewHeaderButtonInterface = {
  viewId: string;
  color: string;
  tabItem: SpaceViewTypeTabItem;
  isSelected: boolean;
};

const buttonStyles: CSSProperties = {};

const NavButton = styled(Button)<{ $isSelected: boolean }>`
  margin: unset;
  padding: 0rem 1rem;
  color: ${({ $isSelected }) => ($isSelected ? 'var(--color-primary-500)' : 'var(--color-gray-900)')};
  font-weight: var(--fontWeight-regular);
`;

const SpaceViewHeaderButton = (props: SpaceViewHeaderButtonInterface): React.ReactElement => {
  const hook = useComponent(props);
  const { t } = useTranslation();

  return (
    <NavButton $isSelected={props.isSelected} style={buttonStyles} onClick={hook.onClick} variant="text">
      {t(props.tabItem.label)}
    </NavButton>
  );
};

export default SpaceViewHeaderButton;

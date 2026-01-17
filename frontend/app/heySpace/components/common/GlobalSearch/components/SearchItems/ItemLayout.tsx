import { FC, ReactNode } from 'react';

import { ellipsizeInTheEnd } from 'common/utils';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';

import {
  ActionButtons,
  ArchivedIcon,
  BUTTONS_CLASS_NAME,
  ImgWrapper,
  Item,
  ItemSubtitle,
  Title,
  TitleWrapper,
} from './styled';

interface ItemLayoutInterface {
  img: ReactNode;
  title: string;
  subtitle: ReactNode;
  actionButtons?: ReactNode;
  isArchived?: boolean;
  onClick?: VoidFunction;
}
export const ItemLayout: FC<ItemLayoutInterface> = ({ img, subtitle, title, isArchived, actionButtons, onClick }) => (
  <Item onClick={onClick}>
    <ImgWrapper>
      {img}
      {isArchived && <ArchivedIcon width="1.6rem" />}
    </ImgWrapper>
    <TitleWrapper>
      <Title isArchived={isArchived}>
        <TooltipedHoveredComponent message={title}>{ellipsizeInTheEnd(title, 50)}</TooltipedHoveredComponent>
      </Title>
      <ItemSubtitle isArchived={isArchived}>{subtitle}</ItemSubtitle>
    </TitleWrapper>
    <ActionButtons className={BUTTONS_CLASS_NAME}>{actionButtons}</ActionButtons>
  </Item>
);

import React, { MouseEventHandler, FC } from 'react';
import styles from './styles.css';

import colors from 'styles/colors.css';
import { doNothing } from 'common/utils';

type TeamMemberNavLinkButtonInterface = {
  isSelected?: boolean;
  color?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const defaultProps = {
  isSelected: false,
  color: colors.wisteriaColor,
  onClick: doNothing,
};

const TeamMemberNavLinkButton: ReactFCWithChildren<TeamMemberNavLinkButtonInterface> = (props) => (
  <div
    className={`${props.className || styles.Component} ${props.isSelected ? styles.selected : ''}`}
    onClick={props.onClick}
  >
    {props.children}
  </div>
);

TeamMemberNavLinkButton.defaultProps = defaultProps;

export default TeamMemberNavLinkButton;

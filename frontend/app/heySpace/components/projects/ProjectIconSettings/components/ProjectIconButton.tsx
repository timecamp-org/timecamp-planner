import { FC } from 'react';

import { IconButton } from '@mui/material';

import { BaseProjectIcon, ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';

import styles from '../styles.css';

interface ProjectIconButtonInterface {
  iconType: ProjectIconTypes;
  onClick: (iconType: ProjectIconTypes) => void;
  selectedIcon: ProjectIconTypes;
}

export const ProjectIconButton: FC<ProjectIconButtonInterface> = ({ iconType, onClick, selectedIcon }) => {
  const isSelected = iconType === selectedIcon;

  return (
    <IconButton
      disableTouchRipple
      onClick={() => onClick(iconType)}
      className={`${styles.projectSettingsButton} ${styles.icon} ${isSelected ? styles.selectedSettingsButton : ''}`}
    >
      <BaseProjectIcon iconType={iconType} />
    </IconButton>
  );
};

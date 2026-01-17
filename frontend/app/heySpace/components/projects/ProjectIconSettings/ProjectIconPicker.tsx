import { FC } from 'react';

import { ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';

import { ProjectIconButton } from './components/ProjectIconButton';
import styles from './styles.css';

interface ProjectIconPickerInterface {
  iconType: ProjectIconTypes;
  onIconChange: (iconType: ProjectIconTypes) => void;
  className?: string;
  onBlur?: () => void;
}

const ICON_LIST = Object.values(ProjectIconTypes);

export const ProjectIconPicker: FC<ProjectIconPickerInterface> = ({ iconType, onIconChange, className, onBlur }) => (
  <ul className={`${styles.options} ${className}`} onBlur={onBlur}>
    {ICON_LIST.map((icon) => (
      <li key={icon}>
        <ProjectIconButton iconType={icon} selectedIcon={iconType} onClick={onIconChange} />
      </li>
    ))}
  </ul>
);

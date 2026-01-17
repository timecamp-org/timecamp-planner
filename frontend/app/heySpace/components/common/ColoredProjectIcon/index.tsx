import React from 'react';

import { BaseProjectIcon } from './BaseProjectIcon';
import { useComponent } from './hook';
import styles from './styles.css';

export interface ColoredProjectIconInterface {
  projectId: string;
  className?: string;
  isPrivateClassName?: string;
  width?: number;
  height?: number;
  size?: 'xs' | 'sm' | 'lg' | 'xl';
}

const defaultProps = {
  isPrivateClassName: '',
};

const ColoredProjectIcon: React.FC<ColoredProjectIconInterface> = (props) => {
  const { color, iconType } = useComponent(props);

  return (
    <div className={styles.wrapper}>
      <BaseProjectIcon iconType={iconType} color={color} size={props.size} width={props.width} />
    </div>
  );
};

ColoredProjectIcon.defaultProps = defaultProps;

export default ColoredProjectIcon;

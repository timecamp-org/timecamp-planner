/* eslint-disable @typescript-eslint/ban-types */

import { CSSProperties, FC } from 'react';

import styles from './styles.css';

export interface TaskItemInterface {
  title: string;
  subTitle: string;
  // tslint:disable-next-line: ban-types
  wrapperStyles: Object;
  isSelected: boolean;
  wrapperClass?: string;
  titleStyle?: CSSProperties;
  subTitleStyle?: CSSProperties;
}

export const TaskItem: FC<TaskItemInterface> = ({
  title,
  subTitle,
  wrapperStyles,
  isSelected,
  wrapperClass,
  subTitleStyle,
  titleStyle,
}) => (
  <div className={`${styles.frame} ${isSelected && styles.selected} ${wrapperClass}`} style={wrapperStyles}>
    <div className={`${styles.contentWrapper} `}>
      <p className={`${styles.content} ${styles.name} ${styles.ellipsized}`} style={titleStyle}>
        {title}
      </p>
      <p className={`${styles.content} ${styles.ellipsized}`} style={subTitleStyle}>
        {subTitle}
      </p>
    </div>
  </div>
);

import { FC } from 'react';

import { TaskTEmplateInterface } from '../../types';
import styles from '../styles.css';

import {
  AssigneePlaceholder,
  ChecklistPlaceholder,
  DueDatePlaceholder,
  ProgressPlaceholder,
  TagsPlaceholder,
} from './Placeholders';

export const Task: FC<Partial<TaskTEmplateInterface>> = ({ name }) => (
  <div className={styles.card}>
    <div className={styles.row}>
      <p className={styles.taskName}>{name}</p>
      <ProgressPlaceholder />
    </div>
    <div className={styles.row}>
      <ChecklistPlaceholder />
      <DueDatePlaceholder />
    </div>
    <div className={styles.row}>
      <TagsPlaceholder />
      <AssigneePlaceholder />
    </div>
  </div>
);

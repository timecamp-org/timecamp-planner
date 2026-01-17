import { FC } from 'react';

import { TaskTEmplateInterface } from '../../types';
import { useTaskPlaceholders } from '../hooks';
import styles from '../styles.css';

import { AddCard } from './AddCard';
import { Task } from './Task';

interface ListInterface {
  name: string;
  taskTemplates: TaskTEmplateInterface[];
  addRandomTasks: boolean;
}

export const List: FC<ListInterface> = ({ name, taskTemplates = [], addRandomTasks }) => {
  const getRandomTasks = useTaskPlaceholders();

  const tasks = addRandomTasks ? getRandomTasks() : taskTemplates;

  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        <p className={styles.listName}>{name}</p>
      </div>
      <ul className={styles.taskList}>
        {tasks?.map((task) => (
          <Task {...task} key={task.id} />
        ))}
      </ul>
      <AddCard />
    </div>
  );
};

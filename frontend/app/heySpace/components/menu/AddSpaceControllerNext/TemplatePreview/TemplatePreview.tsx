import { FC, memo } from 'react';

import { flatten } from 'lodash';

import { ProjectTemplateInterface } from '../types';

import { List } from './components/List';
import styles from './styles.css';

export interface TemplatePreviewInterface {
  template?: ProjectTemplateInterface;
}

// memo is used because render causes random task placeholders creation
export const TemplatePreview: FC<TemplatePreviewInterface> = memo(({ template }) => {
  const hasTEmplateTasks = !!flatten(template.taskListTemplates.map((list) => list.taskTemplates)).length;

  return (
    <div className={`${styles.appTheme} ${styles.preview}`}>
      <div className={styles.board}>
        {template?.taskListTemplates?.map(({ name, taskTemplates, id }) => (
          <List key={id} name={name} taskTemplates={taskTemplates} addRandomTasks={!hasTEmplateTasks} />
        ))}
      </div>
    </div>
  );
});

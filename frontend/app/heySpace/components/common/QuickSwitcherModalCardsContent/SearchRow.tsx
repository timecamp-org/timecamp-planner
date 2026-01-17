import React from 'react';

import { Map } from 'immutable';

import { Id } from 'common/utils/identifier';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import ProjectName from 'components/projects/projectName/ProjectName';
import TaskNameOutput from 'components/tasks/taskName/TaskNameOutput';

import styles from './styles.css';

interface SearchRowInterface {
  descriptor: Map<string, Id>;
  isHighlighted: boolean;
  onNavigateToSpace: (projectId: Id) => void;
  onNavigateToCard: (taskId: Id) => void;
  onMouseMoveOverListItem: (taskId: Id) => void;
}

const SearchRow: React.FC<SearchRowInterface> = ({
  descriptor,
  isHighlighted,
  onMouseMoveOverListItem,
  onNavigateToCard,
  onNavigateToSpace,
}) => {
  const taskId: Id = descriptor.get('taskId');
  const projectId: Id = descriptor.get('projectId');

  return (
    <div
      key={taskId}
      className={`${styles.searchRow} ${isHighlighted ? styles.highlightedItem : ''}`}
      onMouseMove={() => onMouseMoveOverListItem(taskId)}
    >
      <ColoredProjectIcon projectId={projectId} />
      <div className={styles.description}>
        <div className={styles.title}>
          <TaskNameOutput className={styles.taskName} taskId={taskId} onClick={() => onNavigateToCard(taskId)} />
        </div>
        <div className={styles.info}>
          <div onClick={() => onNavigateToSpace(projectId)}>
            <ProjectName className={styles.projectName} projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SearchRow);

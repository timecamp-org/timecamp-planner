import AssigneesController from 'commonComponents/AssigneesController';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import { EntityType } from 'models/domain/EntityModel/types';

import { PureCardInterface } from '..';
import styles from '../styles.css';

export function renderAssigneeWithPopover(props: PureCardInterface) {
  return (
    <StopClickEventPropagation>
      <AssigneesController
        objectType={EntityType.TASK_DATA}
        objectId={props.taskId}
        maxAssigneesRenderCount={2}
        shouldRenderTitle={false}
        isEditable={true}
        onSetIsPopoverOpen={props.onSetIsAssigneePickerOpen}
        variant="minimized"
        personIconClass={styles.avatar}
      />
    </StopClickEventPropagation>
  );
}

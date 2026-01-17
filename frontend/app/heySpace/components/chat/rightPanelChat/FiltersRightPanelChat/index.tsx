import React, { FC } from 'react'

import { Id } from 'common/utils/identifier'
import TaskFilters from 'components/tasks/taskFilters/TaskFilters'
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types'
import RightPanelLabel from '../RightPanelLabel'
import { FILTERS } from '../utils/panelNames'
import useComponent from './hook'
import styles from './styles.css'

export type FiltersRightPanelChatInterface = {
  containerId: Id,
  containerType: TaskFiltersContainerType,
  targetType: TaskFiltersTargetType,
}

const FiltersRightPanelChat: FC<FiltersRightPanelChatInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <div className={styles.Component}>
      {
        <TaskFilters
          containerId={props.containerId}
          containerType={props.containerType}
          targetType={props.targetType}
          className={styles.tasksFilters}
          isDueDatesEnabled={!hook.isCalendar}
          labelRenderer={() => (
            <RightPanelLabel
              objectId={props.containerId}
              currentPanelName={FILTERS}
            />
          )}
        />
      }
    </div>
  )
}

export default FiltersRightPanelChat

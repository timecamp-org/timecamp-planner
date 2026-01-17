import React from 'react'
import useComponent from './hook'
import SpaceCalendarView from 'components/projects/spaceCalendar/SpaceCalendarView'
import styles from './styles.css'

const MyTasksCalendar = () => {
  const {
    projectId,
    filterId,
  } = useComponent()
  return (
    <SpaceCalendarView
      innerClassName={styles.calendar}
      projectId={projectId}
      filterId={filterId}
      isConversation={true}
    />
  )
}

export default MyTasksCalendar

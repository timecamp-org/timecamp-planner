import React, { FC } from 'react'
import styles from './styles.css'
import useComponent from './hook'
import { Id } from 'common/utils/identifier'
import VideoSkeletonLoader from 'commonComponents/skeletons/VideoSkeletonLoader'

export type JitsiMeetInterface = {
  objectId: Id,
}

const JitsiMeet: FC<JitsiMeetInterface> = (props) => {
  const { isLoading } = useComponent(props)
  return (
    <div
      className={styles.container}
    >
      {isLoading && renderLoader()}
      <div
        id="jitsi-container"
        className={styles.jitsyContainer}
      />
    </div>
  )
}

function renderLoader() {
  return (
    <div className={styles.loader}>
      <VideoSkeletonLoader />
    </div>
  )
}

export default JitsiMeet
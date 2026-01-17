import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles.css'

import Reaction from 'commonComponents/Reaction/task'

TaskReactionList.propTypes = {
  groupedReactions: ImmutablePropTypes.map.isRequired,
}

function TaskReactionList(props) {
  return (
    <div className={styles.Component}>
      {props.groupedReactions.keySeq().map(renderReaction)}
    </div>
  )

  function renderReaction(emojiColonFormat) {
    return (
      <Reaction
        className={styles.reaction}
        taskId={props.taskId}
        key={emojiColonFormat}
        emojiCode={emojiColonFormat}
        userIds={props.groupedReactions.get(emojiColonFormat)}
      />
    )
  }
}

export default TaskReactionList

import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'

import TaskName from '../../tasks/TaskName'
import TaskDueDate from '../../tasks/TaskDueDate'
import TaskProgress from '../../tasks/TaskProgress'
import TaskEstimateEffort from '../../tasks/TaskEstimateEffort'
import UsersAvatarsList from 'commonComponents/UsersAvatarsList'
import TagList from '../../tags/TagList'

import { MoveCardModalContext } from '../../kanban/ProjectKanban/enhancers/EnhanceProjectKanban'

Card.propTypes = {
  taskId: PropTypes.string.isRequired,
  taskName: PropTypes.string,
  taskColor: PropTypes.string,
}

Card.defaultProps = {
  taskName: '',
}

export default function Card(props) {
  return (
    <MoveCardModalContext.Consumer>
      {({ onOpenMoveCardModal }) => (
        <React.Fragment>
          <TouchableOpacity
            onPress={props.onClickCard}
            onLongPress={() => onOpenMoveCardModal(props.taskId)}
            style={styles.component}
          >
            {renderColorLine()}
            <View style={styles.content}>
              <TaskName styles={styles.taskName} taskId={props.taskId} />
              <View style={styles.row}>
                <View style={styles.firstRowItem}>
                  <UsersAvatarsList taskId={props.taskId} />
                </View>
                <View style={styles.middleRowItem}>
                  <TaskDueDate styles={styles.rowItemText} taskId={props.taskId} />
                </View>
                <TaskEstimateEffort styles={styles.taskEstimateEffort} taskId={props.taskId} />
                <TaskProgress styles={styles.taskProgress} taskId={props.taskId} />
              </View>
              <View style={styles.row}>
                <TagList objectId={props.taskId} />
              </View>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}
    </MoveCardModalContext.Consumer>
  )

  function renderColorLine() {
    return (
      <View
        style={{
          ...styles.colorLine,
          backgroundColor: props.taskColor,
        }}
      />
    )
  }

}

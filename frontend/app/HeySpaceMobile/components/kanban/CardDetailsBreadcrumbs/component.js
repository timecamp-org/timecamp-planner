import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { TouchableOpacity } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'
import MoveCardModalContent from '../../kanban/MoveCardModalContent'
import IOSMoveCardModal from '../../kanban/IOSMoveCardModal'
import ProjectName from '../../projects/ProjectName'
import ListName from '../../list/ListName'
import ChevronRight from 'Icons/ChevronRight'
import { cloudyBlueColor } from 'common/commonStyles/colors'
import isIOS from '../../../utils/isIOS'


CardDetailsBreadcrumbs.propTypes = {
  taskId: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  onClickBreadcrumbs: PropTypes.func,
  onCloseMoveCardModal: PropTypes.func,
}

function CardDetailsBreadcrumbs(props) {
  return (
    <TouchableOpacity
      style={styles.Component}
      onPress={props.onClickBreadcrumbs}
    >
      <ProjectName projectId={props.projectId} styles={styles.projectName} />
      <ChevronRight style={styles.separator} color={cloudyBlueColor} />
      <ListName listId={props.listId} styles={styles.sectionName} />
      {isIOS
        ? <IOSMoveCardModal
          isVisible={props.isMoveCardModalOpened}
          taskId={props.taskId}
          onClose={props.onCloseMoveCardModal}
        />
        : <UniversalModal
          isVisible={props.isMoveCardModalOpened}
          onBackdropPress={props.onCloseMoveCardModal}
        >
          <MoveCardModalContent
            taskId={props.taskId}
            onClose={props.onCloseMoveCardModal}
          />
        </UniversalModal>
      }
    </TouchableOpacity>
  )
}

export default CardDetailsBreadcrumbs

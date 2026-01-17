import React from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import { whiteTwoColor } from 'common/commonStyles/colors';

import List from '../../kanban/List'
import AddListModal from '../../kanban/AddListModal'
import Add from 'Icons/Add'
import Loader from 'commonComponents/Loader/objectColor'
import UniversalModal from 'commonComponents/UniversalModal'
import MoveCardModalContent from '../../kanban/MoveCardModalContent'
import IOSMoveCardModal from '../../kanban/IOSMoveCardModal'
import isIOS from '../../../utils/isIOS'

export default function ProjectKanban(props) {
  return (
    <View style={styles.component}>
      {props.isLoading ? renderLoader(props) : renderKanban(props)}
    </View>
  )
}

function renderLoader({ projectId }) {
  return (
    <Loader
      containerStyles={styles.loaderWrapper}
      objectId={projectId}
    />
  )
}


function renderKanban(props) {
  return (
    <ScrollView
      pagingEnabled
      horizontal
      nestedScrollEnabled
      keyboardShouldPersistTaps={'always'}
    >
      {
        props.listIds.map(renderList)
      }
      {props.conversationUserId
        ? null
        : renderAddListButton(props)
      }
      {
        props.isAddListModalOpen && <AddListModal
          projectId={props.projectId}
          onClose={() => props.onSetIsAddListModalOpen(false)}
        />
      }
      {isIOS
        ? <IOSMoveCardModal
          isVisible={props.isMoveCardModalOpened}
          taskId={props.taskToMoveId}
          onClose={props.onCloseMoveCardModal}
        />
        : <UniversalModal
          isVisible={props.isMoveCardModalOpened}
          // style={styles.modal}
          onBackdropPress={props.onCloseMoveCardModal}
        >
          <MoveCardModalContent
            taskId={props.taskToMoveId}
            onClose={props.onCloseMoveCardModal}
          />
        </UniversalModal>
      }
    </ScrollView>
  )
}

function renderList(listId) {
  return (
    <View key={`kanbanList_${listId}`} style={styles.listWrapper}>
      <List listId={listId} />
    </View>
  )
}

function renderAddListButton(props) {
  return (
    <View style={styles.listWrapper}>
      <TouchableOpacity
        style={styles.addList}
        key={`addList`}
        onPress={() => props.onSetIsAddListModalOpen(true)}
      >
        <View style={styles.addIconWrapper}>
          <Add svgProps={{ style: styles.addIcon }} currentColor={whiteTwoColor} />
        </View>
        <Text style={styles.addListText}>
          {'Add a list...'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

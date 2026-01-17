import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { cloudyBlueColor } from 'styles/colors'
import { doNothing } from 'common/utils'
import { EntityType } from 'models/domain/EntityModel/types'
import tabTypes from '../../tasks/TaskNavigation/tabTypes'

import { View, TouchableOpacity, Text, ScrollView } from 'react-native'
import CardDetailsProgress from '../../kanban/CardDetailsProgress'
import TaskNameIO from '../../tasks/TaskNameIO'
import UsersAvatarsList from 'commonComponents/UsersAvatarsList'
import CardDetailsDueDate from '../../kanban/CardDetailsDueDate'
import CardDescription from '../../kanban/CardDescription'
import CardChecklist from '../../kanban/CardChecklist'
import TagList from '../../tags/TagList'
import AssignUserModal from '../../kanban/AssignUserModal'
import CardDetailsAttachments from '../../kanban/CardDetailsAttachments'
import AssignUser from 'Icons/AssignUser'
import TaskNavigation from '../../tasks/TaskNavigation'
import MessageBoard from '../../chat/MessageBoard'
import TagIcon from 'Icons/Tags'
import CardDetailsBreadcrumbs from '../../kanban/CardDetailsBreadcrumbs'
import Loader from 'commonComponents/Loader/objectColor'
import isIOS from '../../../utils/isIOS'
import CardDetailsOptionsActionSheet from '../CardDetailsOptionsActionSheet'
import AccessForbiddenScreen from '../../common/AccessForbiddenScreen'

CardDetails.propTypes = {
  taskId: PropTypes.string.isRequired,
  isCardMoreOptionsActionSheetOpened: PropTypes.bool,
  isAssignUserModalOpen: PropTypes.bool,
  selectedTab: PropTypes.string.isRequired,
  taskColor: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,

  onChangeTab: PropTypes.func.isRequired,
  onToggleCardMoreOptionsActionSheet: PropTypes.func,
  onOpenAssignUserModal: PropTypes.func.isRequired,
  onCloseAssignUserModal: PropTypes.func.isRequired,
  onNavigateToManageAssignees: PropTypes.func.isRequired,
}

CardDetails.defaultProps = {
  isCardMoreOptionsActionSheetOpened: false,
  isAssignUserModalOpen: false,
  selectedTab: tabTypes.DETAILS,
  onToggleCardMoreOptionsActionSheet: doNothing,
  onChangeTab: doNothing,
}

export default function CardDetails(props) {
  if (props.isLoading) {
    return (
      <Loader
        objectId={props.taskId}
        containerStyles={styles.loaderWrapper}
      />
    )
  } else if (!props.hasAccessToTask) {
    return <AccessForbiddenScreen />
  } else {
    return (
      <View style={styles.component}>
        <TaskNavigation
          taskId={props.taskId}
          selectedTab={props.selectedTab}
          onChangeTab={props.onChangeTab}
          taskColor={props.taskColor}
        />
        {props.selectedTab === tabTypes.DETAILS && renderDetails(props)}
        {props.selectedTab === tabTypes.COMMENTS && renderComments(props)}
        {isIOS && <CardDetailsOptionsActionSheet
          taskId={props.taskId}
          isVisible={props.isCardMoreOptionsActionSheetOpened}
          onClose={props.onToggleCardMoreOptionsActionSheet}
        />}
      </View>
    )
  }
}

function renderComments(props) {
  return (
    <MessageBoard
      objectId={props.taskId}
      objectType={EntityType.TASK_DATA}
    />
  )
}

function renderDetails(props) {
  return (
    <Fragment>
      <CardDetailsBreadcrumbs taskId={props.taskId} />
      {renderTaskName(props)}
      <ScrollView
        style={styles.scrollContentWrapper}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode={'on-drag'}
      >
        {renderProgressBar(props)}
        <View style={styles.assigneesAndDueDate}>
          {renderAssignees(props)}
          <CardDetailsDueDate taskId={props.taskId} />
        </View>
        {isIOS
          ? null
          : <AssignUserModal
            taskId={props.taskId}
            isVisible={props.isAssignUserModalOpen}
            onClickClose={props.onCloseAssignUserModal}
          />
        }
        {renderTags(props)}
        <CardChecklist taskId={props.taskId} style={styles.checklist} />
        <CardDescription taskId={props.taskId} />
        <CardDetailsAttachments taskId={props.taskId} />
      </ScrollView>
    </Fragment>
  )
}

function renderTaskName(props) {
  return (
    <TaskNameIO
      taskId={props.taskId}
      taskInputStyles={styles.taskInputStyles}
      taskNameWrapperStyles={styles.taskNameWrapperStyles}
      taskNameTextStyles={styles.taskNameTextStyles}
    />
  )
}

function renderProgressBar(props) {
  return (
    <View style={styles.progressWrapper}>
      <Text style={styles.progressLabel}>{'Progress: '}</Text>
      <CardDetailsProgress taskId={props.taskId} />
    </View>
  )
}

function renderAssignees(props) {
  return (
    <TouchableOpacity
      style={styles.assigners}
      onPress={isIOS ? props.onNavigateToManageAssignees : props.onOpenAssignUserModal}
    >
      <UsersAvatarsList
        taskId={props.taskId}
        maxItems={-1}
        spaceBetween={20}
        countRenderer={countRenderer}
        componentStyles={styles.usersAvatarsList}
        alwaysShowCounter
      />
    </TouchableOpacity>
  )
}

function renderTags(props) {
  return (
    <View style={styles.tagsListWrapper}>
      <TagIcon style={styles.icon} color={cloudyBlueColor} />
      <TagList styles={styles.tagList} objectId={props.taskId} />
    </View>
  )
}

function countRenderer(maxItems, size, spaceBetween) {
  return (
    <View
      style={{
        ...styles.count,
        marginLeft: size > 0 ? -1 * spaceBetween : 0,
      }}
    >
      <AssignUser
        svgProps={{ style: styles.assignUserIcon }}
        currentColor={cloudyBlueColor}
      />
    </View>
  )
}

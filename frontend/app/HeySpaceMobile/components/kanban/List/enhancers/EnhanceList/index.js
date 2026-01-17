import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'
import { List } from 'immutable'

import { onUpdateList } from 'models/domain/ListsModel/actions'
import {
  selectFilteredTaskIdsByListId,
  selectIsCurrentUserListOrSpaceFollower,
  selectProjectIdByListId,
  selectListEstimatedEffort, selectConversationFilteredTaskIdsByListId,
} from 'models/domain/ListsModel/selectors'
import { selectIsExtensionEnabled } from 'models/domain/ExtensionsModel/selectors/domain'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types'
import { onAddUserToTaskListFollowers, onRemoveUserFromTaskListFollowers } from 'models/domain/ListsModel/actions'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import listOptionsEnum from '../../listOptionsEnum'
import { NavigationService } from '../../../../../../common/services'
import get from 'lodash/get'
import {
  selectConversationIdByProjectId,
  selectDirectChatPartner, selectProjectIdByConversationId,
  selectProjectIsDirectChat
} from '../../../../../../common/models/domain/ProjectsModel/selectors'

function getProjectIdFromNavigationState() {
  const currentRoute = NavigationService.getCurrentRoute()
  return get(currentRoute, 'params.projectId')
}

function getConversationUserId(reduxState) {
  const currentRouteProjectId = getProjectIdFromNavigationState()

  if (currentRouteProjectId) {
    const isDirectChat = selectProjectIsDirectChat(reduxState, { projectId: currentRouteProjectId })
    const projectIdByConversationId = selectProjectIdByConversationId(reduxState, { conversationId: currentRouteProjectId })

    // we want to make sure it's a conversation so we need to determine
    // if projectId we got is referencing direct chat
    // or if it is actually a conversationId
    if (isDirectChat || projectIdByConversationId) {
      const conversationId = isDirectChat
        ? selectConversationIdByProjectId(reduxState, { projectId: currentRouteProjectId })
        : currentRouteProjectId
      return selectDirectChatPartner(reduxState, { conversationId })
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

function Enhance(ComposedComponent) {
  class EnhanceList extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    }

    state = {
      modalOpen: null,
    }

    render() {
      return (
        <ComposedComponent
          listId={this.props.listId}
          taskIds={this.props.taskIds}
          usersToAssign={this.props.usersToAssign}

          isUserFollowingList={this.props.isUserFollowingList}
          isEstimatesExtensionEnabled={this.props.isEstimatesExtensionEnabled}
          listEstimatedEffort={this.props.listEstimatedEffort}

          modalOpen={this.state.modalOpen}
          listOptions={Object.values(listOptionsEnum)}

          onCloseModal={this.onCloseModal}
          onSelectOption={this.onSelectOption}
          onOpenModal={this.onOpenModal}
        />
      )
    }

    onSelectOption(item) {
      switch (item) {
        case listOptionsEnum.ARCHIVE_LIST: {
          this.props.onArchiveList()
          break
        }
        case listOptionsEnum.FOLLOW_LIST: {
          this.onToggleFollow()
          break
        }
        default: {
          this.setState({
            modalOpen: item,
          })
        }
      }
    }

    onToggleFollow() {
      if (this.props.isUserFollowingList) {
        return this.props.onStopFollowing(this.props.currentUserId)
      }

      return this.props.onStartFollowing(this.props.currentUserId)
    }

    onOpenModal(item) {
      this.setState({
        modalOpen: item,
      })
    }

    onCloseModal() {
      this.setState({
        modalOpen: null,
      })
    }

  }

  function mapStateToProps(state, props) {
    const projectId = selectProjectIdByListId(state, { listId: props.listId })
    const organizationId = selectCurrentOrganizationId(state)
    const conversationUserId = getConversationUserId(state)

    return {
      taskIds: conversationUserId
        ? selectConversationFilteredTaskIdsByListId(state, { userId: conversationUserId, listId: props.listId, projectId })
        : selectFilteredTaskIdsByListId(state, { listId: props.listId, projectId }),

      isUserFollowingList: selectIsCurrentUserListOrSpaceFollower(state, { listId: props.listId }),
      isEstimatesExtensionEnabled: selectIsExtensionEnabled(state, { organizationId, projectId, extensionNamespace: ExtensionNamespace.AGILE }),
      listEstimatedEffort: selectListEstimatedEffort(state, { listId: props.listId, countArchived: false }),
      currentUserId: selectCurrentUserId(state),
      usersToAssign: conversationUserId
        ? new List([conversationUserId])
        : undefined,
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onArchiveList: () => dispatch(onUpdateList(props.listId, { isArchived: true })),
      onStartFollowing: (currentUserId) => dispatch(onAddUserToTaskListFollowers(props.listId, currentUserId)),
      onStopFollowing: (currentUserId) => dispatch(onRemoveUserFromTaskListFollowers(props.listId, currentUserId)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceList)
}

export default Enhance

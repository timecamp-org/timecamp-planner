import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import {
  onFetchProjectViewData,
  onFetchSpaceOrConversationViewData
} from 'models/domain/RequestModel/actions'
import { selectRequestIsLoadingInitially, selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { selectProjectViewRequestIsRepeatable, selectProjectViewRequestIsLoadingInitially } from 'models/domain/RequestModel/selectors/projectViewRequest'
import {
  selectConversationIdByProjectId,
  selectDirectChatPartner,
  selectProjectColor,
  selectProjectIsDirectChat
} from 'models/domain/ProjectsModel/selectors'
import { selectConversationListIds, selectFilteredListIdsInOrder } from 'models/domain/ListsModel/selectors'
import EnhanceWithRefreshData from 'common/enhancers/EnhanceWithRefreshData'
import { getConversationViewData } from 'common/models/domain/RequestModel/constants/requestTypes'
import { getRequestTypeWithParams } from 'common/models/domain/RequestModel/helpers'
import { doNothing } from 'common/utils/index'
import { onFetchOrganizationExtensions } from "common/models/domain/ExtensionsModel/actions";
import { ExtensionNamespace } from "common/models/domain/ExtensionsModel/types";

export const MoveCardModalContext = React.createContext({
  onOpenMoveCardModal: doNothing,
})

function Enhance(ComposedComponent) {
  @EnhanceWithRefreshData({
    action: onFetchSpaceOrConversationViewData,
    paramsToInject: [
      { key: 'objectId' },
      { key: 'filterId', defaultValue: null },
      { key: 'force', defaultValue: null },
      { key: 'purgeTasksOrder', defaultValue: true },
    ],
  })
  class EnhanceProjectKanban extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      conversationUserId: PropTypes.string,
      isDirectChat: PropTypes.bool,

      onFetchProjectViewData: PropTypes.func.isRequired,
    }

    state = {
      isAddListModalOpen: false,
      isMoveCardModalOpened: false,
      taskToMoveId: null,
    }

    render() {
      return (
        <MoveCardModalContext.Provider
          value={{
            onOpenMoveCardModal: this.onOpenMoveCardModal,
          }}
        >
          <ComposedComponent
            projectId={this.props.objectId}
            listIds={this.props.listIds}
            conversationUserId={this.props.conversationUserId}
            projectColor={this.props.projectColor}
            isLoading={this.props.isLoading}
            isAddListModalOpen={this.state.isAddListModalOpen}
            isMoveCardModalOpened={this.state.isMoveCardModalOpened}
            taskToMoveId={this.state.taskToMoveId}
            onCloseMoveCardModal={this.onCloseMoveCardModal}
            onSetIsAddListModalOpen={this.onSetIsAddListModalOpen}
          />
        </MoveCardModalContext.Provider>
      )
    }

    onOpenMoveCardModal(taskToMoveId) {
      this.setState({
        taskToMoveId,
        isMoveCardModalOpened: true,
      })
    }

    onCloseMoveCardModal() {
      this.setState({
        taskToMoveId: null,
        isMoveCardModalOpened: false,
      })
    }

    onSetIsAddListModalOpen(isAddListModalOpen) {
      this.setState({
        isAddListModalOpen,
      })
    }

    onFetchProjectOrConversationViewData() {
      if (this.props.isRequestRepeatable) {
        const objectId = this.props.conversationUserId
          ? this.props.conversationId
          : this.props.objectId
        this.props.onFetchSpaceOrConversationViewData(objectId)
      }
    }

    componentDidMount() {
      this.onFetchProjectOrConversationViewData()
      this.props.onFetchAgileExtensionData()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.projectId !== this.props.objectId) {
        this.onFetchProjectOrConversationViewData()
      }
    }

  }

  function mapStateToProps(state, props) {
    const conversationId = selectConversationIdByProjectId(state, { projectId: props.objectId })
    const conversationUserId = selectDirectChatPartner(state, { conversationId })
    const isDirectChat = selectProjectIsDirectChat(state, { projectId: props.objectId })
    const listIds = isDirectChat
      ? selectConversationListIds(state, { userId: conversationUserId })
      : selectFilteredListIdsInOrder(state, { projectId: props.objectId })

    const getConversationViewDataRequestType = getRequestTypeWithParams(getConversationViewData, { fetchArchived: false })

    return {
      conversationId,
      listIds,
      conversationUserId: isDirectChat
        ? conversationUserId
        : null,
      projectColor: selectProjectColor(state, { projectId: props.objectId }),
      isLoading: isDirectChat
        ? selectRequestIsLoadingInitially(state, {
          requestType: getConversationViewDataRequestType,
          objectId: props.objectId,
        })
        : selectProjectViewRequestIsLoadingInitially(state, { projectId: props.objectId }),
      isRequestRepeatable: isDirectChat
        ? selectIsRequestRepeatable(state, {
          requestType: getConversationViewDataRequestType,
          objectId: props.objectId,
        })
        : selectProjectViewRequestIsRepeatable(state, { projectId: props.objectId }),
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onFetchProjectViewData: (projectId) => dispatch(onFetchProjectViewData(projectId)),
      onFetchSpaceOrConversationViewData: (objectId) => dispatch(onFetchSpaceOrConversationViewData(objectId)),
      onFetchAgileExtensionData: () => dispatch(onFetchOrganizationExtensions(
        [ExtensionNamespace.AGILE]
      )),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceProjectKanban)
}

export default Enhance

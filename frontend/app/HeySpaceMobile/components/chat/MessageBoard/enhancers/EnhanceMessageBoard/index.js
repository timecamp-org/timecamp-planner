import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { onCreateMessagesWithFiles } from 'models/domain/MessagesModel/actions'
import { selectMessageList } from 'models/domain/MessagesModel/selectors'
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors'
import { selectEntityContainedRequestHasMoreToLoad } from 'models/domain/PaginationModel/selectors'
import { EntityType } from 'models/domain/EntityModel/types'
import { getMessageBoard, initiallyFetchChatItems } from 'models/domain/RequestModel/constants/requestTypes'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceMessageBoard extends BaseComponent {

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      objectType: PropTypes.string.isRequired,
      isTabNavigationVisible: PropTypes.bool,
    }

    static defaultProps = {
      isTabNavigationVisible: true,
    }

    state = {
      isMessageOptionsModalOpen: false,
      messageOptionsModalParams: { messageId: null },
    }

    render() {
      return (
        <ComposedComponent
          onUploadFiles={this.props.onUploadFiles}
          objectId={this.props.objectId}
          objectType={this.props.objectType}
          isTabNavigationVisible={this.props.isTabNavigationVisible}
          isFirstRequestLoading={this.props.isFirstRequestLoading}

          isMessageOptionsModalOpen={this.state.isMessageOptionsModalOpen}
          messageOptionsModalParams={this.state.messageOptionsModalParams}

          onMessageLongPress={this.onMessageLongPress}
          onMessageOptionsModalHide={this.onMessageOptionsModalHide}
        />
      )
    }

    onMessageLongPress(messageId) {
      this.setState({
        isMessageOptionsModalOpen: true,
        messageOptionsModalParams: {
          messageId,
        }
      })
    }

    onMessageOptionsModalHide() {
      this.setState({
        isMessageOptionsModalOpen: false,
        messageOptionsModalParams: {
          messageId: null,
        }
      })
    }

  }

  function mapStateToProps(state, props) {
    const projectId = props.objectType === EntityType.TASK_DATA
      ? selectProjectIdByTaskId(state, { taskId: props.objectId })
      : props.objectId

    return {
      messagesIds: selectMessageList(state, {
        objectId: props.objectId,
        withActivities: props.objectType === EntityType.TASK_DATA,
      }),
      hasMoreToLoad: selectEntityContainedRequestHasMoreToLoad(state, {
        requestType: getMessageBoard,
        objectId: props.objectId,
        containerId: projectId,
        containerType: EntityType.PROJECT_DATA,
      }),
      isFirstRequestLoading: selectRequestIsLoading(state, { requestType: initiallyFetchChatItems, objectId: props.objectId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUploadFiles: (files) => dispatch(onCreateMessagesWithFiles(files, props.objectId)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMessageBoard)
}

export default Enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from '../../BaseComponent'

import {
  onFetchMessageBoard,
  onFetchMessageBoardIfDidNotFetchAlready,
} from '../../../models/domain/MessagesModel/actions'
import { EntityType } from '../../../models/domain/EntityModel/types'
import {
  selectRequestIsLoading,
  selectRequestIsFailure,
  selectRequestIsSuccess,
  selectIsRequestFinished,
  selectRequestIsLoadingInitially,
} from '../../../models/domain/RequestModel/selectors'
import { initiallyFetchChatItems, fetchMoreChatItems, getMessageBoard } from '../../../models/domain/RequestModel/constants/requestTypes'
import { selectEntityContainedRequestHasMoreToLoad } from '../../../models/domain/PaginationModel/selectors'
import { selectProjectIdByTaskId } from '../../../models/domain/TasksModel/selectors'
import EnhanceWithRefreshData from '../../../enhancers/EnhanceWithRefreshData'
import { FIRST_PROJECT_NAME } from '../../../models/domain/ProjectsModel/constants'
import { doNothing } from '../../../utils'
import { isOnline } from 'models/domain/AppModel/selectors';
const messagesLimit = 20

function Enhance(ComposedComponent) {
  @EnhanceWithRefreshData({
    action: onFetchMessageBoardIfDidNotFetchAlready,
    paramsToInject: [
      { key: 'objectId' },
      { key: 'limit', defaultValue: messagesLimit },
      { key: 'objectType' },
      { key: 'force', defaultValue: true },
    ],
  })
  class FetchChatItems extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      getNumberOfMessagesFittingOnPage: PropTypes.func.isRequired,
      objectType: PropTypes.string,
    }

    static defaultProps = {
      objectType: EntityType.PROJECT_DATA,
      getNumberOfMessagesFittingOnPage: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          objectId={this.props.objectId}
          onFetchMoreItems={this.onFetchMoreItems}
          isFetchingMoreChatItemsFailure={this.props.isFetchingMoreChatItemsFailure}
          isFirstRequestLoading={this.props.isFirstRequestLoading}
          isFetchingMoreChatItems={this.props.isFetchingMoreChatItems}
          isFirstRequestSuccess={this.props.isFirstRequestSuccess}
          hasMoreToFetch={this.props.hasMoreToFetch}
          isFirstRequestFinished={this.props.isFirstRequestFinished}
        />
      )
    }

    onFetchMoreItems() {
      if (!this.props.isFetchingMoreChatItems) {
        this.props.onFetchMessageBoard(this.props.objectId, this.props.getNumberOfMessagesFittingOnPage(), this.props.objectType)
      }
    }

    onFetchMessageBoardIfDidNotFetchAlready() {
      if (this.props.objectId && this.props.objectType && this.props.objectId !== FIRST_PROJECT_NAME) {
        this.props.onFetchMessageBoardIfDidNotFetchAlready(this.props.objectId, this.props.getNumberOfMessagesFittingOnPage(), this.props.objectType)
      }
    }

    componentDidMount() {
      this.onFetchMessageBoardIfDidNotFetchAlready()
    }

    componentDidUpdate(prevProps) {
      if (this.props.objectId !== prevProps.objectId && this.props.objectType) {
        this.onFetchMessageBoardIfDidNotFetchAlready()
      }
      if(prevProps.isOnline!==this.props.isOnline && this.props.isOnline){
        this.props.onFetchMessageBoard(this.props.objectId, this.props.getNumberOfMessagesFittingOnPage(), this.props.objectType, true)
      }
    }

  }

  function mapStateToProps(state, props) {
    const projectId = props.objectType === EntityType.TASK_DATA
      ? selectProjectIdByTaskId(state, { taskId: props.objectId })
      : props.objectId

    return {
      isOnline: isOnline(state),
      isFetchingMoreChatItemsFailure: selectRequestIsFailure(state, { requestType: fetchMoreChatItems, objectId: props.objectId }),
      isFetchingMoreChatItems: selectRequestIsLoading(state, { requestType: fetchMoreChatItems, objectId: props.objectId }),
      isFirstRequestLoading: selectRequestIsLoadingInitially(state, { requestType: initiallyFetchChatItems, objectId: props.objectId }),
      isFirstRequestSuccess: selectRequestIsSuccess(state, { requestType: initiallyFetchChatItems, objectId: props.objectId }),
      hasMoreToFetch: selectEntityContainedRequestHasMoreToLoad(state, {
        requestType: getMessageBoard,
        objectId: props.objectId,
        containerId: projectId,
        containerType: EntityType.PROJECT_DATA,
      }),
      isFirstRequestFinished: selectIsRequestFinished(state, { requestType: initiallyFetchChatItems, objectId: props.objectId }),
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onFetchMessageBoardIfDidNotFetchAlready: (objectId, limit, objectType) => dispatch(onFetchMessageBoardIfDidNotFetchAlready(objectId, limit, objectType)),
      onFetchMessageBoard: (objectId, limit, objectType, force=false) => dispatch(onFetchMessageBoard(objectId, limit, objectType, force )),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(FetchChatItems)
}

export default (Enhance)

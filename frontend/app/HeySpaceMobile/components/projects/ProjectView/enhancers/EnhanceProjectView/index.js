import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import { connect } from 'react-redux'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { InteractionManager } from 'react-native'

import tabTypes from '../../constants'
import { createProject } from 'models/domain/RequestModel/constants/requestTypes'
import { RequestStatus } from 'models/domain/RequestModel/types'
import { selectRequestStatus } from 'models/domain/RequestModel/selectors'
import {
  selectProjectIdByConversationId,
  selectProjectIsDirectChat,
  selectProjectIsGroupChat
} from 'models/domain/ProjectsModel/selectors'
import {
  onSetIsConversationVisible,
  onFetchProject, onSetProjectLatestVisit
} from 'models/domain/ProjectsModel/actions'
import { selectFileInUploadName } from 'models/domain/FilesModel/selectors'
import { selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { getProject } from 'models/domain/RequestModel/constants/requestTypes'
import { ProjectMetadataType } from 'models/domain/ProjectsModel/types'
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import EnhanceWithRefreshData from '../../../../../../common/enhancers/EnhanceWithRefreshData'

const projectQueryParams = { metadata: [ProjectMetadataType.PEOPLE] }

function Enhance(ComposedComponent) {
  @EnhanceWithRefreshData({
    action: onFetchProject,
    paramsToInject: [
      { key: 'projectId' },
      { key: 'queryParams', defaultValue: projectQueryParams },
    ],
  })
  class EnhanceProjectView extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      fileNameInUpload: PropTypes.string,
      isDirectChat: PropTypes.bool.isRequired,
      isGroupChat: PropTypes.bool.isRequired,
    }

    state = {
      selectedTab: this.props.selectedTab || tabTypes.CHAT,
    }

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}

          selectedTab={this.state.selectedTab}
          shouldRenderProjectContent={this.props.shouldRenderProjectContent}
          isGroupChat={this.props.isGroupChat}
          isDirectChat={this.props.isDirectChat}
          fileNameInUpload={this.props.fileNameInUpload}

          onChangeTab={this.onChangeTab}
        />
      )
    }

    onChangeTab(tabType) {
      if (tabType !== this.state.selectedTab) {
        this.setState({
          selectedTab: tabType,
        })
      }
    }

    onFetchProject() {
      if (this.props.isProjectRequestRepeatable && this.props.projectId) {
        InteractionManager.runAfterInteractions(() => {
          this.props.onFetchProject(this.props.projectId)
        })
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.projectId !== this.props.projectId) {
        this.onFetchProject()
        this.setState({
          selectedTab: this.props.selectedTab || tabTypes.CHAT,
        })
        if (this.props.conversationId) {
          this.props.onSetIsConversationVisible(this.props.conversationId, true)
        }
        this.props.onSetProjectLatestVisit(this.props.projectId)
      }
    }

    componentDidMount() {
      this.onFetchProject()
      this.props.onSetProjectLatestVisit(this.props.projectId)
    }

  }

  const mapStateToProps = (state, props) => {
    let projectId = props.spaceId || props.projectId

    if (props.conversationId) {
      projectId = selectProjectIdByConversationId(state, { conversationId: props.conversationId })
    }

    const createdProjectRequestStatus = selectRequestStatus(state, {
      objectId: projectId,
      requestType: createProject,
    })
    const requestType = getRequestTypeWithParams(getProject, projectQueryParams)
    return {
      shouldRenderProjectContent: createdProjectRequestStatus === RequestStatus.SUCCESS || createdProjectRequestStatus === undefined,
      isGroupChat: selectProjectIsGroupChat(state, { projectId }),
      isDirectChat: selectProjectIsDirectChat(state, { projectId }),
      projectId,
      conversationId: props.conversationId,
      fileNameInUpload: selectFileInUploadName(state),
      isProjectRequestRepeatable: selectIsRequestRepeatable(state, { requestType, objectId: projectId })
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetIsConversationVisible: (conversationId, isVisible) => dispatch(onSetIsConversationVisible(conversationId, isVisible)),
      onFetchProject: (projectId) => dispatch(onFetchProject(projectId, projectQueryParams)),
      onSetProjectLatestVisit: (projectId) => dispatch(onSetProjectLatestVisit(projectId))
    }
  }

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceProjectView))
}

export default Enhance


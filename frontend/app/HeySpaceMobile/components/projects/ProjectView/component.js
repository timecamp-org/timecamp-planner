import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'

import ProjectNavigation from '../../projects/ProjectNavigation'
const ProjectKanban = lazy(() => import('../../kanban/ProjectKanban'))
const MessageBoard = lazy(() => import('../../chat/MessageBoard'))
import { EntityType } from 'models/domain/EntityModel/types'
import { whiteTwoColor } from 'common/commonStyles/colors'

import styles from './styles'
import tabTypes from './constants'
import Loader from 'commonComponents/Loader'
import FileUploadProgressBar from '../../chat/FileUploadProgressBar'
import SuspenseComponent from 'commonComponents/SuspenseComponent'

ProjectView.propTypes = {
  projectId: PropTypes.string.isRequired,
  shouldRenderProjectContent: PropTypes.bool.isRequired,
  fileNameInUpload: PropTypes.string,
  isDirectChat: PropTypes.bool.isRequired,
  isGroupChat: PropTypes.bool.isRequired,
}

export default function ProjectView(props) {
  if (props.shouldRenderProjectContent) {
    return (
      <View style={styles.container}>
        {
          props.isGroupChat
            ? null
            : <ProjectNavigation
              projectId={props.projectId}
              selectedTab={props.selectedTab}
              onChangeTab={props.onChangeTab}
            />
        }
        {
          props.fileNameInUpload && <FileUploadProgressBar fileName={props.fileNameInUpload} />
        }
        <SuspenseComponent disableLoader>
          {renderTab()}
        </SuspenseComponent>
      </View>
    )
  } else {
    return <Loader isLoading />
  }

  function renderTab() {
    switch (props.selectedTab) {
      case tabTypes.CHAT: {
        return (
          <MessageBoard
            objectId={props.projectId}
            objectType={EntityType.PROJECT_DATA}
            isTabNavigationVisible={!props.isGroupChat}
          />
        )
      }
      case tabTypes.BOARD: {
        return (
          <ProjectKanban objectId={props.projectId} />
        )
      }
      default: {
        return (
          <Text>{'CHAT'}</Text>
        )
      }
    }
  }

}

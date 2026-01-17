import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import MessageBoard from 'components/chat/MessageBoard'
import { EntityType } from 'models/domain/EntityModel/types'

ProjectMessageBoard.propTypes = {
  projectId: PropTypes.string,
  addUsersToProjectModalProjectId: PropTypes.string,
}

function ProjectMessageBoard(props) {
  // TODO: it should by conrolled outside render method...
  return (
    <Fragment>
      {
        props.projectId && <MessageBoard 
        objectId={props.projectId} 
        objectType={EntityType.PROJECT_DATA}
        />
      }
    </Fragment>
  )
}

export default ProjectMessageBoard

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectProjectIsPrivate } from 'models/domain/ProjectsModel/selectors'
import { onUpdateProjectPrivacy } from 'models/domain/ProjectsModel/actions'
import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

function enhance(ComposedComponent) {
  class EnhanceManageSpacePrivacyScreen extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      isSpacePrivate: PropTypes.bool.isRequired,
      onChangeSpaceIsPrivate: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isSpacePrivate={this.props.isSpacePrivate}
          isProjectEditable={this.props.isProjectEditable}
          onSetSpaceIsPublic={this.onSetSpaceIsPublic}
          onSetSpaceIsPrivate={this.onSetSpaceIsPrivate}
        />
      )
    }

    onSetSpaceIsPublic() {
      this.props.onChangeSpaceIsPrivate(false)
    }

    onSetSpaceIsPrivate() {
      this.props.onChangeSpaceIsPrivate(true)
    }

  }

  const mapStateToProps = (state, props) => ({
    isSpacePrivate: selectProjectIsPrivate(state, { projectId: props.projectId }),
    isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeSpaceIsPrivate: (isPrivate) => dispatch(onUpdateProjectPrivacy(props.projectId, isPrivate)),
  })

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceManageSpacePrivacyScreen))
}

export default enhance

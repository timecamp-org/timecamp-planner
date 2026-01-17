import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProjectColors from 'common/commonStyles/projectColors'

import BaseComponent from 'BaseComponent'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { onColorUpdate } from 'models/domain/ProjectsModel/actions'
import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

const colorsWithNames = ProjectColors.getProjectColorsWithNames()

function enhance(ComposedComponent) {
  class EnhanceManageSpaceColorScreen extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      spaceColor: PropTypes.string.isRequired,
      onChangeSpaceColor: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          colorsWithNames={colorsWithNames}
          selectedColor={this.props.selectedColor}
          isProjectEditable={this.props.isProjectEditable}
          onChangeSpaceColor={this.props.onChangeSpaceColor}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => ({
    selectedColor: selectProjectColor(state, { projectId: props.projectId }),
    isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeSpaceColor: (spaceColor) => dispatch(onColorUpdate(props.projectId, spaceColor)),
  })

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceManageSpaceColorScreen))
}

export default enhance

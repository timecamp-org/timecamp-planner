import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { onProjectCreate } from 'models/domain/ProjectsModel/actions'
import {
  selectSpaceName,
  selectSpacePurpose,
  selectSpaceColor,
  selectSpaceMembers,
  selectSpaceIsPrivate,
} from 'models/mobile/CreateSpaceModel/selectors'
import { onResetCreateSpaceData } from 'models/mobile/CreateSpaceModel/actions'
import generateId from '../../../../../../common/utils/generate-pushid'
import RouteName from '../../../../AppNavigation/routeNames'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceCreateSpaceButton extends BaseComponent {

    static propTypes = {
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      isPrivate: PropTypes.bool.isRequired,
      people: ImmutablePropTypes.listOf(PropTypes.string).isRequired,

      onCreateSpace: PropTypes.func.isRequired,
      onResetCreateSpaceData: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          text={'Create'}
          onPress={this.onCreateSpace}
        />
      )
    }

    onCreateSpace() {
      const id = generateId()
      const {
        name,
        description,
        color,
        isPrivate,
        people,
      } = this.props

      this.props.onCreateSpace({
        id,
        name,
        description,
        color,
        isPrivate,
        people,
      })

      this.props.onResetCreateSpaceData()
      NavigationService.reset(RouteName.PROJECT, { projectId: id })
    }

  }

  const mapStateToProps = (state, props) => ({
    name: selectSpaceName(state),
    description: selectSpacePurpose(state),
    color: selectSpaceColor(state),
    isPrivate: selectSpaceIsPrivate(state),
    people: selectSpaceMembers(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onCreateSpace: (projectFields) => dispatch(onProjectCreate(projectFields)),
    onResetCreateSpaceData: () => dispatch(onResetCreateSpaceData()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateSpaceButton)
}

export default enhance

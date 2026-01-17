import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import RouteName from 'components/AppNavigation/routeNames'
import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceNavigateToManageSpaceAddMember extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
    }


    render() {
      // Ugly logic here because of AppRouting
      if (this.props.isProjectEditable) {
        return (
          <ComposedComponent
            text={'Add'}
            onPress={this.onPress}
          />
        )
      } else {
        return null
      }
    }

    onPress() {
      NavigationService.navigate(RouteName.MANAGE_SPACE_MEMBER_ADD, { projectId: this.props.projectId })
    }

  }

  const mapStateToProps = (state, props) => ({
    isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
  })

  return connect(mapStateToProps)(EnhanceNavigateToManageSpaceAddMember)
}

export default enhance

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import * as CreateSpaceSelectors from 'models/mobile/CreateSpaceModel/selectors'
import * as CreateSpaceActions from 'models/mobile/CreateSpaceModel/actions'
import RouteName from '../../../../AppNavigation/routeNames'
import ProjectColors from 'common/commonStyles/projectColors'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceCreateSpace extends BaseComponent {

    static propTypes = {
      currentUserId: PropTypes.string.isRequired,
      spaceName: PropTypes.string.isRequired,
      spacePurpose: PropTypes.string.isRequired,
      spaceMembersCount: PropTypes.number.isRequired,
      spaceColor: PropTypes.string.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,

      onChangeSpaceName: PropTypes.func.isRequired,
      onChangeSpacePurpose: PropTypes.func.isRequired,
      onChangeSpaceColor: PropTypes.func.isRequired,
      onChangeIsCurrentUserFollowingSpace: PropTypes.func.isRequired,
      onResetCreateSpaceData: PropTypes.func.isRequired,
      onAddSpaceMember: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isSpaceBeingCreated={true}
          spaceName={this.props.spaceName}
          spacePurpose={this.props.spacePurpose}
          spaceMembersCount={this.props.spaceMembersCount}
          spaceColor={this.props.spaceColor}
          isCurrentUserFollowingSpace={this.props.isCurrentUserFollowingSpace}

          onChangeSpaceName={this.props.onChangeSpaceName}
          onChangeSpacePurpose={this.props.onChangeSpacePurpose}
          onChangeIsCurrentUserFollowingSpace={this.onChangeIsCurrentUserFollowingSpace}
          onNavigateToSpaceMembers={this.onNavigateToCreateSpaceMembers}
          onNavigateToSpaceColor={this.onNavigateToCreateSpaceColor}
          onNavigateToSpacePrivacy={this.onNavigateToCreateSpacePrivacy}
        />
      )
    }

    onChangeIsCurrentUserFollowingSpace() {
      this.props.onChangeIsCurrentUserFollowingSpace(!this.props.isCurrentUserFollowingSpace)
    }

    onNavigateToCreateSpaceMembers() {
      NavigationService.navigate(RouteName.CREATE_SPACE_MEMBERS)
    }

    onNavigateToCreateSpaceColor() {
      NavigationService.navigate(RouteName.CREATE_SPACE_COLOR)
    }

    onNavigateToCreateSpacePrivacy() {
      NavigationService.navigate(RouteName.CREATE_SPACE_PRIVACY)
    }

    componentDidMount() {
      this.props.onAddSpaceMember(this.props.currentUserId)
      this.props.onChangeSpaceColor(ProjectColors.getRandomProjectColor())
    }


    componentWillUnmount() {
      this.props.onResetCreateSpaceData()
    }

  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    spaceName: CreateSpaceSelectors.selectSpaceName(state),
    spacePurpose: CreateSpaceSelectors.selectSpacePurpose(state),
    spaceMembersCount: CreateSpaceSelectors.selectSpaceMembersCount(state),
    spaceColor: CreateSpaceSelectors.selectSpaceColor(state),
    isCurrentUserFollowingSpace: CreateSpaceSelectors.selectIsCurrentUserFollowingSpace(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeSpaceName: (spaceName) => dispatch(CreateSpaceActions.onChangeSpaceName(spaceName)),
    onChangeSpacePurpose: (spacePurpose) => dispatch(CreateSpaceActions.onChangeSpacePurpose(spacePurpose)),
    onChangeIsCurrentUserFollowingSpace: (isFollowing) => dispatch(CreateSpaceActions.onChangeIsCurrentUserFollowingSpace(isFollowing)),
    onChangeSpaceColor: (spaceColor) => dispatch(CreateSpaceActions.onChangeSpaceColor(spaceColor)),
    onResetCreateSpaceData: () => dispatch(CreateSpaceActions.onResetCreateSpaceData()),
    onAddSpaceMember: (userId) => dispatch(CreateSpaceActions.onAddSpaceMember(userId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateSpace)
}

export default enhance

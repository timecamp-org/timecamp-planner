import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { ellipsizeInTheEnd } from 'common/utils';

import { selectUserAssignedProjectNames } from 'models/domain/ProjectsModel/selectors';
import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';

const MAX_SPACES = 5;

function Enhance(ComposedComponent) {
  class EnhanceGuestSpacesButton extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    state = {
      isTooltipVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          userId={this.props.userId}
          displayShortValue={this.getDisplayShortValue()}
          displayValue={this.getDisplayValue()}
          spacesCount={this.props.userAssignedProjectNames.size}
          isTooltipVisible={this.state.isTooltipVisible}
          hiddenSpacesCount={this.getHiddenSpacesCount()}
          isCurrentUserWorkspaceAdmin={this.props.isCurrentUserWorkspaceAdmin}
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    getDisplayShortValue() {
      return ellipsizeInTheEnd(this.props.userAssignedProjectNames.join(', ').trim(), 20);
    }

    getDisplayValue() {
      const spaceNames =
        this.props.userAssignedProjectNames.size > MAX_SPACES
          ? this.props.userAssignedProjectNames.slice(0, MAX_SPACES)
          : this.props.userAssignedProjectNames;
      return spaceNames.join(', ').trim();
    }

    getHiddenSpacesCount() {
      return this.props.userAssignedProjectNames.size - MAX_SPACES;
    }

    onClick() {}

    onMouseEnter() {
      this.setState({ isTooltipVisible: true });
    }

    onMouseLeave() {
      this.setState({ isTooltipVisible: false });
    }
  }

  function mapStateToProps(state, props) {
    return {
      userAssignedProjectNames: selectUserAssignedProjectNames(state, {
        userId: props.userId,
      }),
      isCurrentUserWorkspaceAdmin: selectIsCurrentUserOrganizationAdmin(state),
    };
  }

  return connect(mapStateToProps)(EnhanceGuestSpacesButton);
}

export default Enhance;

import React from "react";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectIsCurrentUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors";

function enhance(ComposedComponent) {
  class EnhanceTooltipedGuestDisabledElement extends BaseComponent {
    render() {
      return (
        <ComposedComponent
          isDisabled={this.props.isCurrentUserGuest}
          children={this.props.children}
        />
      );
    }
  }

  const mapStateToProps = (state) => ({
    isCurrentUserGuest: selectIsCurrentUserOrganizationGuest(state),
  });

  return connect(mapStateToProps)(EnhanceTooltipedGuestDisabledElement);
}

export default enhance;

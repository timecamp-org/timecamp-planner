import React from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { onDeactivateUserFromOrganization } from 'models/domain/OrganizationsModel/actions';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { FIRST_PROJECT_NAME } from 'models/domain/ProjectsModel/constants';

export default function enhance(Component) {
  @EnhanceWithRouter()
  class EnhanceDeactivateGuestController extends BaseComponent {
    render() {
      return <Component onDeactivateGuest={this.onDeactivateGuest} />;
    }

    onDeactivateGuest() {
      this.props.onDeactivateUser();
      this.props.history.push(`/projects/${FIRST_PROJECT_NAME}`);
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onDeactivateUser: () =>
        dispatch(onDeactivateUserFromOrganization(props.userId)),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceDeactivateGuestController);
}

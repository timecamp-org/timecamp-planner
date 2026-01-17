import React from "react";
import BaseComponent from "commonEnhancers/BaseComponent";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import getDefaultAppUrl from "../../../../../utils/getDefaultAppUrl";
import { selectFirstProjectData } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";

function Enhance(ComposedComponent) {
  class EnhanceRedirectToFirstProjectTasks extends BaseComponent {
    // eslint-disable-line

    static propTypes = {
      firstProjectData: PropTypes.object,
    };

    render() {
      const { firstProjectData } = this.props;
      const appUrl = getDefaultAppUrl({ firstProjectData });
      return <ComposedComponent url={appUrl} />;
    }
  }

  function mapStateToProps(state) {
    return {
      firstProjectData: selectFirstProjectData(state),
    };
  }

  return connect(mapStateToProps, null)(EnhanceRedirectToFirstProjectTasks);
}

export default Enhance;

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectIsRequestFinished } from "../../../../../../common/models/domain/RequestModel/selectors";
import * as RequestTypesConstants from "../../../../../../common/models/domain/RequestModel/constants/requestTypes";
import EnhanceWithRouter from "../../../../../enhancers/EnhanceWithRouter";
import { selectCurrentUserId } from "../../../../../../common/models/domain/UsersModel/selectors/domain";

function enhance(ComposedComponent) {
  class EnhanceFirstProjectPlaceholder extends BaseComponent {
    static propTypes = {
      isLoading: PropTypes.bool.isRequired,
    };

    render() {
      return <ComposedComponent isLoading={this.props.isLoading} />;
    }
  }

  const mapStateToProps = (state, props) => {
    const currentUserId = selectCurrentUserId(state);
    return {
      isLoading: !selectIsRequestFinished(state, {
        requestType: RequestTypesConstants.getUserInitialData,
        objectId: currentUserId,
      }),
    };
  };

  return EnhanceWithRouter(
    null,
    false
  )(connect(mapStateToProps)(EnhanceFirstProjectPlaceholder));
}

export default enhance;

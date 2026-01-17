import React from "react";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { onFetchUserApps } from "models/domain/UserAppsModel/actions";
import { selectCurrentUserAppIds } from "models/domain/UserAppsModel/selectors";
import {
  selectIsRequestRepeatable,
  selectRequestIsLoading,
} from "models/domain/RequestModel/selectors";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";
import { getUserApps } from "models/domain/RequestModel/constants/requestTypes";

function Enhance(ComposedComponent) {
  class EnhanceMyApps extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          appIds={this.props.appIds}
          isLoading={this.props.isLoading}
        />
      );
    }

    componentDidMount() {
      if (this.props.isRequestRepeatable) {
        this.props.onFetchUserApps();
      }
    }
  }

  function mapStateToProps(state, props) {
    const currentUserId = selectCurrentUserId(state);
    return {
      appIds: selectCurrentUserAppIds(state),
      isRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType: getUserApps,
        objectId: currentUserId,
      }),
      isLoading: selectRequestIsLoading(state, {
        requestType: getUserApps,
        objectId: currentUserId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onFetchUserApps: () => dispatch(onFetchUserApps()),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMyApps);
}

export default Enhance;

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectEntityType } from "models/domain/EntityModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceWithEntityType extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      // this enhancer
      entityType: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent {...this.props} entityType={this.props.entityType} />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      entityType: selectEntityType(state, { entityId: props.objectId }),
    };
  };

  return connect(mapStateToProps)(EnhanceWithEntityType);
}

export default Enhance;

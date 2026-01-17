import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectUserNickname } from "models/domain/UsersModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceUserNickname extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
      nickname: PropTypes.string.isRequired,
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      nickname: selectUserNickname(state, { userId: props.userId }),
    };
  };

  return connect(mapStateToProps)(EnhanceUserNickname);
}

export default enhance;

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

import {
  selectCurrentUserLastName,
  selectCurrentUserId,
} from "models/domain/UsersModel/selectors/domain";
import * as UsersModelActions from "models/domain/UsersModel/actions";

export default function enhance(Component) {
  class EnhanceUserLastNameInput extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      required: PropTypes.bool,
      label: PropTypes.string,
      autoFocus: PropTypes.bool,
      maxLength: PropTypes.number,

      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onKeyDown: PropTypes.func,
      onKeyUp: PropTypes.func,
    };

    static defaultProps = {
      onFocus: doNothing,
      onBlur: doNothing,
      onKeyDown: doNothing,
      onKeyUp: doNothing,
    };

    state = {
      lastName: null,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          lastName={this.props.lastName}
          required={this.props.required}
          label={this.props.label}
          maxLength={this.props.maxLength}
          autoFocus={this.props.autoFocus}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onUpdate={this.onLastNameUpdate}
        />
      );
    }

    onLastNameUpdate(event) {
      const text = event.target.value;
      this.props.onLastNameUpdate(this.props.currentUserId, text);
    }

    onFocus(event) {
      const text = event.target.value;
      this.setState({ lastName: text });
      this.props.onFocus();
    }

    onBlur(event) {
      const text = event.target.value;
      if (text !== this.state.lastName) {
        this.props.onUpdateUser();
        this.props.onBlur();
        this.setState({ lastName: null });
      } else {
        // ok
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      lastName: selectCurrentUserLastName(state),
      currentUserId: selectCurrentUserId(state),
    };
  };

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onLastNameUpdate: (userId, lastName) =>
        dispatch(UsersModelActions.onLastNameUpdate(userId, lastName)),
      onUpdateUser: () => dispatch(UsersModelActions.onUpdateUser(null, true)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceUserLastNameInput);
}

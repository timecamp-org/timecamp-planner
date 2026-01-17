import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import {
  selectUserFirstName,
  selectUserLastName,
  selectUserEmail,
  selectUserIsBot,
} from "models/domain/UsersModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceWithPersonFullNameAndEmail extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string,

      displayLastNameFirst: PropTypes.bool,
      firstItemClassName: PropTypes.string,
      secondItemClassName: PropTypes.string,
    };

    static defaultProps = {
      displayLastNameFirst: false,
    };

    render() {
      return (
        <ComposedComponent
          secondItemClassName={this.props.secondItemClassName}
          firstItemClassName={this.props.firstItemClassName}
          fullName={this.getUserName()}
          email={this.props.email}
          isBot={this.props.isBot}
        />
      );
    }

    getUserName() {
      const { firstName, lastName } = this.props;

      if (!(firstName && lastName)) {
        return null;
      }

      return this.props.displayLastNameFirst
        ? `${lastName} ${firstName}`
        : `${firstName} ${lastName}`;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      firstName: selectUserFirstName(state, { userId: props.userId }),
      lastName: selectUserLastName(state, { userId: props.userId }),
      email: selectUserEmail(state, { userId: props.userId }),
      isBot: selectUserIsBot(state, { userId: props.userId }),
    };
  };

  return connect(mapStateToProps)(EnhanceWithPersonFullNameAndEmail);
}

export default Enhance;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getInitials } from 'common/utils/getInitials';

import BaseComponent from 'commonEnhancers/BaseComponent';
import {
  selectUserAvatarUrl,
  selectUserFirstName,
  selectUserLastName,
  selectUserEmail,
} from 'models/domain/UsersModel/selectors/domain';

function Enhance(ComposedComponent) {
  class EnhanceUserAvatar extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
      userId: PropTypes.string.isRequired,

      userAvatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          userAvatarUrl={this.props.userAvatarUrl}
          userInitials={this.getUserInitials()}
        />
      );
    }

    getUserInitials() {
      const { firstName, lastName, email } = this.props;
      return getInitials(firstName, lastName, email);
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      userAvatarUrl: selectUserAvatarUrl(state, { userId: props.userId }),
      firstName: selectUserFirstName(state, { userId: props.userId }),
      lastName: selectUserLastName(state, { userId: props.userId }),
      email: selectUserEmail(state, { userId: props.userId }),
    };
  };

  return connect(mapStateToProps, null)(EnhanceUserAvatar);
}

export default Enhance;

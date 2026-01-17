import React from 'react';

import { selectCurrentUserDateFormat } from 'models/domain/UsersModel/selectors/domain';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function enhance(ComposedComponent) {
  class EnhanceWithCurrentUserDateFormat extends React.Component {
    static propTypes = {
      userFormat: PropTypes.string,
      className: PropTypes.string,
      format: PropTypes.string,
      timestamp: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          format={this.props.format ? this.props.format : this.props.userFormat}
        />
      );
    }
  
}

  const mapStateToProps = (state) => ({
    userFormat: selectCurrentUserDateFormat(state),
  });

  return connect(mapStateToProps, undefined)(EnhanceWithCurrentUserDateFormat);
}

export default enhance;

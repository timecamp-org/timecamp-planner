import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import BaseComponent from 'commonEnhancers/BaseComponent';

class RedirectTo extends BaseComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    search: PropTypes.string,
  };

  render() {
    return (
      <Redirect
        to={{
          pathname: this.props.url,
          search: this.props.search,
        }}
      />
    );
  }
}

export default RedirectTo;

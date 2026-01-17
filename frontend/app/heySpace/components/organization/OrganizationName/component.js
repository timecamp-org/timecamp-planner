import React from 'react';
import PropTypes from 'prop-types';
import { ellipsizeInTheEnd } from 'common/utils';

OrganizationName.propTypes = {
  className: PropTypes.string,
  organizationName: PropTypes.string,
  maxLength: PropTypes.number,
};

OrganizationName.defaultProps = {
  className: '',
  organizationName: '',
};

function OrganizationName(props) {
  const organizationName = props.maxLength
    ? ellipsizeInTheEnd(props.organizationName, props.maxLength)
    : props.organizationName;
  return <div className={props.className}>{organizationName}</div>;
}

export default OrganizationName;

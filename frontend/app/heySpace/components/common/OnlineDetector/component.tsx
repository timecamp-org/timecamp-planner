import React from 'react';

import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';

import { doNothing } from 'common/utils';

OnlineDetector.propTypes = {
  onOnlineChange: PropTypes.func,
};

OnlineDetector.defaultProps = {
  onOnlineChange: doNothing,
};

const pollingConfig = {
  interval: 15 * 1000, // 15s
  url: `${window.__tc3_config?.restApiUri}/_internal/myIp`,
};

function OnlineDetector(props) {
  return <Detector onChange={props.onOnlineChange} polling={pollingConfig} render={renderer} />;
}

function renderer() {
  return <React.Fragment />;
}

export default OnlineDetector;

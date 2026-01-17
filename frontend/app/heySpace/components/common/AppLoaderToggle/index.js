import React from "react";
import { startLoader, stopLoader } from "../../../../common/utils/loader";

import BaseComponent from "commonEnhancers/BaseComponent";

export default class AppLoaderToggle extends BaseComponent {
  static defaultProps = {
    timeout: 100,
  };

  render() {
    return null;
  }

  componentDidMount() {
    const { timeout } = this.props;
    this.timeout = setTimeout(startLoader, timeout);
  }

  componentWillUnmount() {
    stopLoader();
    clearTimeout(this.timeout);
  }
}

import React from 'react';
import { connect } from 'react-redux';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import * as AlertActionTypes from 'models/component/PopUpAlertsModel/constants/actionsTypes';
import { wifiOff } from 'models/component/PopUpAlertsModel/constants/alertLeftIcons';
import { i18n, i18mark } from 'i18n';

import BaseComponent from 'commonEnhancers/BaseComponent';

import * as appActions from '../../../../../../common/models/domain/AppModel/actions';

const OFFLINE_STATUS_TIMEOUT = 10_000;

const AlertIds = {
  OFFLINE: 'OfflineError',
  ONLINE: 'OnlineInfo',
};
const offlineWarningHumanMessage = HumanMessage({
  kind: HumanMessageKind.warning,
  text: i18mark(`Your computer seems to be offline. We are trying to reconnect.`),
});

const onlineInfoHumanMessage = HumanMessage({
  kind: HumanMessageKind.information,
  text: i18mark(`Good to see you back to the online world!`),
});

function EnhanceOnlineDetector(ComposedComponent) {
  class EnhanceOnlineDetector extends BaseComponent {
    timeout = undefined;

    render() {
      return <ComposedComponent onOnlineChange={this.onOnlineChange} />;
    }

    onSetOnline() {
      this.props.onSetIsOnline(true);
      this.props.onRemoveAlert(AlertIds.OFFLINE);
      this.props.onAddAlert({ humanMessage: onlineInfoHumanMessage }, AlertIds.ONLINE);
    }

    onSetOffline() {
      this.props.onSetIsOnline(false);
      this.props.onRemoveAlert(AlertIds.ONLINE);
      this.props.onAddAlert(
        {
          humanMessage: offlineWarningHumanMessage,
          leftIcon: wifiOff,
        },
        AlertIds.OFFLINE,
        false,
        [AlertActionTypes.refreshPage],
      );
    }

    onOnlineChange(isOnline) {
      if (isOnline) {
        this.onSetOnline();
        clearTimeout(this.timeout);
      } else {
        this.timeout = setTimeout(() => {
          this.onSetOffline();
        }, OFFLINE_STATUS_TIMEOUT);
      }
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onAddAlert: (alert, id, isSelfDisposable, actions) =>
        dispatch(PopUpAlertsModelActions.onAddAlert(alert, id, isSelfDisposable, actions)),
      onRemoveAlert: (id) => dispatch(PopUpAlertsModelActions.onRemoveAlert(id)),
      onSetIsOnline: (isOnline) => dispatch(appActions.onSetIsOnline(isOnline)),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceOnlineDetector);
}

export default EnhanceOnlineDetector;

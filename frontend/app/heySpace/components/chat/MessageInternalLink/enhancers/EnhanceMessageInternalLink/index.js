import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectIsTaskDescriptionDirty } from "models/domain/TasksModel/selectors/domain";
import * as AppModelActions from "models/domain/AppModel/actions";
import * as PopUpAlertsModelActions from "models/component/PopUpAlertsModel/actions";
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { i18n } from "i18n";

function Enhance(ComposedComponent) {
  class EnhanceMessageInternalLink extends BaseComponent {
    static propTypes = {
      // needs
      to: PropTypes.string.isRequired,
      className: PropTypes.string,
      shouldStopClickEventPropagation: PropTypes.bool,
      shouldBeDisabledWhenCardDescriptionStateIsDirty: PropTypes.bool,

      // injects
      taskId: PropTypes.string,
      isDescriptionDirty: PropTypes.bool.isRequired,
      onAddAlert: PropTypes.func.isRequired,
      onOpenCardDetailsModal: PropTypes.func.isRequired,
    };

    static defaultProps = {
      shouldStopClickEventPropagation: false,
      shouldBeDisabledWhenCardDescriptionStateIsDirty: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          key={this.props.key}
          link={this.getLink()}
          children={this.props.children}
          onClick={this.onClick}
        />
      );
    }

    getLink() {
      const hostIndex = this.props.to.indexOf(window.location.host);
      const hostLength = window.location.host.length;
      const linkWithoutHost = this.props.to.slice(hostIndex + hostLength);

      if (!this.props.taskId) {
        return linkWithoutHost;
      }

      return `${window.location.pathname}?taskId=${this.props.taskId}`;
    }

    onClick(event) {
      if (this.props.shouldStopClickEventPropagation) {
        event.stopPropagation();
      }
      if (this.props.shouldBeDisabledWhenCardDescriptionStateIsDirty && this.props.isDescriptionDirty) {
        event.preventDefault()
        this.props.onAddAlert({
          humanMessage: HumanMessage({
            kind: HumanMessageKind.warning,
            text: i18n.t(`Save or cancel editing description before opening link`),
          }),
        }, 'try-opening-link-with-card-description-being-dirty')
        return
      }
      if (!this.props.taskId) {
        this.props.onCloseCardDetailsModal();
        return;
      }

      this.props.onOpenCardDetailsModal(this.props.taskId);
    }
  }

  const mapStateToProps = (state, props) => {
    const { taskId } = queryString.parse(props.to.split("?")[1]);

    return {
      isDescriptionDirty: selectIsTaskDescriptionDirty(state),
      taskId,
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      onAddAlert: (alert, alertId) =>
        dispatch(PopUpAlertsModelActions.onAddAlert(alert, alertId)),
      onOpenCardDetailsModal: (taskId) =>
        dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)),
      onCloseCardDetailsModal: () =>
        dispatch(AppModelActions.onSetOpenedCardDetailsModalId(null)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceMessageInternalLink);
}

export default Enhance;

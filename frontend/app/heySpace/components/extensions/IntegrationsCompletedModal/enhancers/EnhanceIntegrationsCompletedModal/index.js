import React from "react";
import { connect } from "react-redux";

import { selectExtensionNames } from "models/domain/ExtensionsModel/selectors/domain";
import { selectCompletedNotConfirmedIntegrations } from "models/domain/IntegrationsModel/selectors";
import { onConfirmIntegrationsStatus } from "models/domain/IntegrationsModel/actions";
import { mergeLists } from "common/utils/immutableUtils";

import BaseComponent from "commonEnhancers/BaseComponent";
import { List } from "immutable";

const emptyList = new List();

export default function EnhanceIntegrationsCompletedModal(Component) {
  class EnhanceIntegrationsCompletedModal extends BaseComponent {
    state = {
      integrationsToShow: emptyList,
    };

    render() {
      return (
        <Component
          integrationsToShow={this.state.integrationsToShow}
          extensionNames={this.props.extensionNames}
          onCloseModal={this.onCloseModal}
        />
      );
    }

    onCloseModal() {
      this.setState({
        integrationsToShow: emptyList,
      });
    }

    componentDidUpdate(prevProps) {
      const oldIntegrationIds = prevProps.completedNotConfirmedIntegrations.map(
        (integration) => integration.get("extensionId")
      );
      const newIntegrations =
        this.props.completedNotConfirmedIntegrations.filter(
          (integration) =>
            !oldIntegrationIds.includes(integration.get("extensionId"))
        );

      if (newIntegrations.size > 0) {
        this.setState({
          integrationsToShow: mergeLists(
            this.state.integrationsToShow,
            newIntegrations
          ),
        });
        const newIntegrationIds = newIntegrations.map((integration) =>
          integration.get("extensionId")
        );
        this.props.onConfirmIntegrationsStatus(newIntegrationIds);
      }
    }
  }

  const mapStateToProps = (state) => {
    const completedNotConfirmedIntegrations =
      selectCompletedNotConfirmedIntegrations(state);
    return {
      completedNotConfirmedIntegrations,
      extensionNames: selectExtensionNames(state),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onConfirmIntegrationsStatus: (extensionIds) =>
      dispatch(onConfirmIntegrationsStatus(extensionIds)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceIntegrationsCompletedModal);
}

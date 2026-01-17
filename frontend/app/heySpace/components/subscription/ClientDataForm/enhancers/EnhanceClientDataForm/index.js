import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  selectShouldClientBeValidated,
  selectIsClientNameValid,
  selectIsClientStreetValid,
  selectIsClientCityValid,
  selectIsClientZipValid,
} from "models/domain/SubscriptionModel/selectors/domain";
import * as SubscriptionModelActions from "models/domain/SubscriptionModel/actions";
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { i18n } from "i18n";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceClientDataForm extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,

      onClientNameUpdate: PropTypes.func.isRequired,
      onClientStreetUpdate: PropTypes.func.isRequired,
      onClientCityUpdate: PropTypes.func.isRequired,
      onClientZipUpdate: PropTypes.func.isRequired,
    };

    state = {
      nameHumanMessageModel: null,
      streetHumanMessageModel: null,
      cityHumanMessageModel: null,
      zipHumanMessageModel: null,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          nameHumanMessageModel={this.state.nameHumanMessageModel}
          streetHumanMessageModel={this.state.streetHumanMessageModel}
          cityHumanMessageModel={this.state.cityHumanMessageModel}
          zipHumanMessageModel={this.state.zipHumanMessageModel}
          onClientNameUpdate={this.onClientNameUpdate}
          onClientStreetUpdate={this.onClientStreetUpdate}
          onClientCityUpdate={this.onClientCityUpdate}
          onClientZipUpdate={this.onClientZipUpdate}
          onValidateName={this.onValidateName}
          onValidateCity={this.onValidateCity}
          onValidateStreet={this.onValidateStreet}
          onValidateZip={this.onValidateZip}
        />
      );
    }

    onValidateName() {
      if (this.props.isNameValid) {
        this.setState({ nameHumanMessageModel: null });
      } else {
        this.onNameInvalid(
          i18n.t("Looks like you forget about your Company name")
        );
      }
    }

    onValidateStreet() {
      if (this.props.isStreetValid) {
        this.setState({ streetHumanMessageModel: null });
      } else {
        this.onStreetInvalid(i18n.t("Looks like you forget about Street"));
      }
    }

    onValidateCity() {
      if (this.props.isCityValid) {
        this.setState({ cityHumanMessageModel: null });
      } else {
        this.onCityInvalid(i18n.t("Looks like you forget about City"));
      }
    }

    onValidateZip() {
      if (this.props.isZipValid) {
        this.setState({ zipHumanMessageModel: null });
      } else {
        this.onZipInvalid(
          i18n.t("Looks like you forget about Zip / postal code")
        );
      }
    }

    onClientNameUpdate(event) {
      const name = event.target.value;
      this.props.onClientNameUpdate(name);
    }

    onClientStreetUpdate(event) {
      const street = event.target.value;
      this.props.onClientStreetUpdate(street);
    }

    onClientCityUpdate(event) {
      const city = event.target.value;
      this.props.onClientCityUpdate(city);
    }

    onClientZipUpdate(event) {
      const zip = event.target.value;
      this.props.onClientZipUpdate(zip);
    }

    onNameInvalid(message) {
      this.setState({
        nameHumanMessageModel: HumanMessage({
          text: message || i18n.t('Name is invalid'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onStreetInvalid(message) {
      this.setState({
        streetHumanMessageModel: HumanMessage({
          text: message || i18n.t('Street is invalid'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onCityInvalid(message) {
      this.setState({
        cityHumanMessageModel: HumanMessage({
          text: message || i18n.t('City is invalid'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onZipInvalid(message) {
      this.setState({
        zipHumanMessageModel: HumanMessage({
          text: message || i18n.t('Zip is invalid'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onValidateInputs() {
      this.onValidateName();
      this.onValidateStreet();
      this.onValidateCity();
      this.onValidateZip();
    }

    componentDidUpdate(prevProps) {
      if (
        !prevProps.shouldClientBeValidated &&
        this.props.shouldClientBeValidated
      ) {
        this.onValidateInputs();
      }
    }
  }

  const mapStateToProps = (state) => ({
    isNameValid: selectIsClientNameValid(state),
    isStreetValid: selectIsClientStreetValid(state),
    isCityValid: selectIsClientCityValid(state),
    isZipValid: selectIsClientZipValid(state),
    shouldClientBeValidated: selectShouldClientBeValidated(state),
  });

  const mapDispatchToProps = (dispatch) => ({
    onClientNameUpdate: (name) =>
      dispatch(SubscriptionModelActions.onClientNameUpdate(name)),
    onClientStreetUpdate: (street) =>
      dispatch(SubscriptionModelActions.onClientStreetUpdate(street)),
    onClientCityUpdate: (city) =>
      dispatch(SubscriptionModelActions.onClientCityUpdate(city)),
    onClientZipUpdate: (zip) =>
      dispatch(SubscriptionModelActions.onClientZipUpdate(zip)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceClientDataForm);
}

export default Enhance;

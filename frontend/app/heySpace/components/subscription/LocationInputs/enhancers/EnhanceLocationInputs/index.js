import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18n } from 'i18n';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import * as SubscriptionModelActions from 'models/domain/SubscriptionModel/actions';
import {
  selectShouldClientBeValidated,
  selectChosenCountryStatesMap,
  selectChosenCountry,
  selectIsClientProvinceValid,
  selectIsClientCountryValid,
  selectClientCountry,
  selectClientProvince
} from 'models/domain/SubscriptionModel/selectors/domain';

function Enhance(ComposedComponent) {
  class EnhanceLocationInputs extends BaseComponent {
    static propTypes = {
      chosenCountry: PropTypes.object.isRequired,

      onClientCountryUpdate: PropTypes.func.isRequired,
      onClientProvinceUpdate: PropTypes.func.isRequired,
    };

    state = {
      countryHumanMessageModel: null,
      provinceHumanMessageModel: null,
    };

    render() {
      return (
        <ComposedComponent
          country={this.props.country}
          province={this.props.province}
          countryStatesMap={this.props.countryStatesMap}
          countryStatesList={this.props.countryStatesMap.keySeq().toList()}
          chosenCountry={this.props.chosenCountry}
          countryHumanMessageModel={this.state.countryHumanMessageModel}
          provinceHumanMessageModel={this.state.provinceHumanMessageModel}
          onClientCountryUpdate={this.onClientCountryUpdate}
          onClientProvinceUpdate={this.onClientProvinceUpdate}
          onValidateCountry={this.onValidateCountry}
          onValidateProvince={this.onValidateProvince}
        />
      );
    }

    onValidateCountry() {
      if (this.props.isCountryValid) {
        this.setState({ countryHumanMessageModel: null });
      } else {
        this.onCountryInvalid(i18n.t('Looks like you forget about Country'));
      }
    }

    onValidateProvince() {
      if (this.props.isProvinceValid) {
        this.setState({ provinceHumanMessageModel: null });
      } else {
        this.onProvinceInvalid(i18n.t('Looks like you forget about Province'));
      }
    }

    onClientCountryUpdate(country) {
      this.props.onClientCountryUpdate(country);
    }

    onClientProvinceUpdate(province) {
      this.props.onClientProvinceUpdate(province);
    }

    onCountryInvalid(message) {
      this.setState({
        countryHumanMessageModel: HumanMessage({
          text: message || i18n.t('Country is invalid'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onProvinceInvalid(message) {
      this.setState({
        provinceHumanMessageModel: HumanMessage({
          text: message || i18n.t('Province is invalid'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onValidateInputs() {
      this.onValidateCountry();
      this.onValidateProvince();
    }

    provinceIsAmong(states) {
      return !!states[this.props.province];
    }

    componentDidUpdate(prevProps) {
      const { chosenCountry } = this.props;

      if (prevProps.chosenCountry !== chosenCountry) {
        if (
          chosenCountry?.states &&
          !this.provinceIsAmong(chosenCountry.states)
        ) {
          // make sure that the (auto-selected) first value
          // in the province SelectInput is put into redux state
          this.props.onClientProvinceUpdate(chosenCountry.states?.[0]);
        } else {
          this.props.onClientProvinceUpdate('');
        }
      }

      if (
        !prevProps.shouldClientBeValidated &&
        this.props.shouldClientBeValidated
      ) {
        this.onValidateInputs();
      }
    }
  }

  const mapStateToProps = (state) => ({
    isProvinceValid: selectIsClientProvinceValid(state),
    isCountryValid: selectIsClientCountryValid(state),
    country: selectClientCountry(state),
    province: selectClientProvince(state),
    countryStatesMap: selectChosenCountryStatesMap(state),
    chosenCountry: selectChosenCountry(state),
    shouldClientBeValidated: selectShouldClientBeValidated(state),
  });

  const mapDispatchToProps = (dispatch) => ({
    onClientCountryUpdate: (country) =>
      dispatch(SubscriptionModelActions.onClientCountryUpdate(country)),
    onClientProvinceUpdate: (province) =>
      dispatch(SubscriptionModelActions.onClientProvinceUpdate(province)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceLocationInputs);
}

export default Enhance;

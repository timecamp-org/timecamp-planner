import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import BaseComponent from 'BaseComponent';
import { doNothing } from 'common/utils';
import TermsAndConditionsWithCheckbox from '../TermsAndConditionsWithCheckbox';
import PrimaryButton from 'commonComponents/PrimaryButton';

export default class GoogleSignUpForm extends BaseComponent {
  static propTypes = {
    fullName: PropTypes.string,
    avatar: PropTypes.string,
    isRegistering: PropTypes.bool,
    isRegisteringWithGoogleAccount: PropTypes.bool,
    isAcceptingTerms: PropTypes.bool,
    message: PropTypes.string,

    onSubmit: PropTypes.func,
    onSetIsAcceptingTerms: PropTypes.func,
  };

  static defaultProps = {
    isRegistering: false,
    isAcceptingTerms: false,
    termsHumanMessageModel: null,

    onSubmit: doNothing,
    onSetIsAcceptingTerms: doNothing,
  };

  render() {
    return (
      <View style={styles.Component}>
        <View style={styles.header}>
          <Image source={{ uri: this.props.avatar }} style={styles.avatar} />
          <Text style={styles.headerText}>{`Hello ${this.props.fullName}`}</Text>
        </View>
        <Text style={styles.hint}>
          {`You're almost ready to explore Planner. Confirm that you agree to our terms and conditions and privacy policy and you're ready to go.`}
        </Text>
        {this.renderForm()}
      </View>
    );
  }

  renderForm() {
    return (
      <React.Fragment>
        {this.renderTermsAndConditionsCheckbox()}
        {this.renderSubmitButton()}
      </React.Fragment>
    );
  }

  renderSubmitButton() {
    return (
      <PrimaryButton
        text={`${this.props.isRegistering ? 'Signing up...' : 'Sign up'}`}
        onPress={this.props.onSubmit}
        isDisabled={this.props.isRegistering}
      />
    );
  }

  renderTermsAndConditionsCheckbox() {
    return (
      <TermsAndConditionsWithCheckbox
        isAcceptingTerms={this.props.isAcceptingTerms}
        message={this.props.message}
        onSetIsAcceptingTerms={this.props.onSetIsAcceptingTerms}
      />
    );
  }
}

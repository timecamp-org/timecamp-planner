import React from 'react';
import { Text, View, Linking } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import CustomCheckbox from 'commonComponents/CustomCheckbox';
import { doNothing } from 'common/utils';
import isIOS from '../../../utils/isIOS';

const termsAndConditionsUrl = 'https://www.timecamp.com/planner/terms-conditions/';
const privacyPolicyUrl = 'https://www.timecamp.com/planner/privacy-policy/';

TermsAndConditionsWithCheckbox.propTypes = {
  isAcceptingTerms: PropTypes.bool,
  message: PropTypes.string,
  onSetIsAcceptingTerms: PropTypes.func,
};

TermsAndConditionsWithCheckbox.defaultProps = {
  isAcceptingTerms: false,
  message: null,
  onSetIsAcceptingTerms: doNothing,
};

export default function TermsAndConditionsWithCheckbox(props) {
  const onTermsAndConditionsPress = isIOS
    ? () => Linking.openURL(termsAndConditionsUrl)
    : () => props.onDownloadFile('Terms and Conditions', termsAndConditionsUrl);

  const onPrivacyPolicyPress = isIOS
    ? () => Linking.openURL(privacyPolicyUrl)
    : () => props.onDownloadFile('Privacy Policy', privacyPolicyUrl);
  return (
    <React.Fragment>
      <View style={styles.termsAndConditions}>
        <CustomCheckbox
          style={styles.checkbox}
          isChecked={props.isAcceptingTerms}
          onPress={props.onSetIsAcceptingTerms}
        />
        <Text style={styles.text}>
          {'By creating an account you agree to the '}
          <Text style={styles.link} onPress={onTermsAndConditionsPress}>
            {'Terms and Conditions'}
          </Text>
          {' and '}
          <Text style={styles.link} onPress={onPrivacyPolicyPress}>
            {'Privacy Policy'}
          </Text>
        </Text>
      </View>
      {props.message && <Text style={styles.message}>{props.message}</Text>}
    </React.Fragment>
  );
}

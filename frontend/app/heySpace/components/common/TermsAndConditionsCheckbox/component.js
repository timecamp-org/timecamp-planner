import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';
import styles from './styles.css';

import Checkbox from 'commonComponents/Checkbox';
import HumanMessage from 'commonComponents/HumanMessage';
import TermsAndConditions from '../TermsAndConditions';

TermsAndConditionsCheckbox.propTypes = {
  isAcceptingTerms: PropTypes.bool,
  termsHumanMessageModel: PropTypes.object,
  onSetIsAcceptingTerms: PropTypes.func,
};

TermsAndConditionsCheckbox.defaultProps = {
  isAcceptingTerms: false,
  onSetIsAcceptingTerms: doNothing,
};

function TermsAndConditionsCheckbox(props) {
  return (
    <div className={styles.Component} onClick={props.onSetIsAcceptingTerms}>
      <Checkbox isChecked={props.isAcceptingTerms} />
      <div className={styles.termsAndConditionsLabel}>
        <TermsAndConditions />
        {props.termsHumanMessageModel ? (
          <HumanMessage className={styles.humanMessage} model={props.termsHumanMessageModel} maxRows={2} />
        ) : null}
      </div>
    </div>
  );
}

export default TermsAndConditionsCheckbox;

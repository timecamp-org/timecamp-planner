import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styles from './styles.css';

import Checkbox from 'commonComponents/Checkbox';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from '../../../../common/i18n';

FeedbackCheckboxWithAdditionalInput.propTypes = {
  label: PropTypes.string.isRequired,
  shouldRenderInput: PropTypes.bool,
  setRef: PropTypes.func.isRequired,
};

FeedbackCheckboxWithAdditionalInput.defaultProps = {
  shouldRenderInput: true,
};

function FeedbackCheckboxWithAdditionalInput({ placeholder, label, shouldRenderInput, setRef }) {
  const [isChecked, onSetIsChecked] = useState(false);
  const [additionalFeedback, onSetAdditionalFeedback] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setRef({
      isChecked,
      additionalFeedback,
    });
  }, [isChecked, additionalFeedback]);

  function onToggleIsChecked() {
    onSetIsChecked(!isChecked);
  }

  function onChangeAdditionalFeedback(event) {
    onSetAdditionalFeedback(event.target.value);
  }

  return (
    <div className={styles.component}>
      <div className={styles.checkboxWrapper}>
        <Checkbox className={styles.checkbox} isChecked={isChecked} onToggleStatus={onToggleIsChecked} />
        <span className={styles.label} onClick={onToggleIsChecked}>
          {t(label)}
        </span>
      </div>
      {shouldRenderInput && isChecked && (
        <UserInput
          className={styles.input}
          autoFocus
          placeholder={t(placeholder)}
          value={additionalFeedback}
          onChange={onChangeAdditionalFeedback}
        />
      )}
    </div>
  );
}

export default FeedbackCheckboxWithAdditionalInput;

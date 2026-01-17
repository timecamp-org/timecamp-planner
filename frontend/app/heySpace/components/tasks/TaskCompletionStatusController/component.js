import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Check } from 'commonComponents/Icons/fontawesome/Check';
import { ActivatableButton } from 'components/buttons/ActivableButton/ActivableButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

TaskCompletionStatusController.propTypes = {
  isTaskCompleted: PropTypes.bool,
  color: PropTypes.string,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
};

TaskCompletionStatusController.defaultProps = {
  isTaskCompleted: false,
  onClick: doNothing,
  onBlur: doNothing,
};

function TaskCompletionStatusController(props) {
  const { t } = useTranslation();

  return (
    <ActivatableButton className={styles.Component} isActive={props.isTaskCompleted} onClick={props.onClick}>
      <Check />
    </ActivatableButton>
  );
}

export default TaskCompletionStatusController;

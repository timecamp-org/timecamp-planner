import { memo } from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

CardEstimatedEffortController.propTypes = {
  taskId: PropTypes.string.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  taskEstimatedEffort: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  localTaskEstimatedEffort: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isControllerOpen: PropTypes.bool,
  hideOnEmpty: PropTypes.bool,
  isTaskEstimatedEffortExists: PropTypes.bool,

  onControllerClick: PropTypes.func,
  onSetIsControllerOpen: PropTypes.func,
  onClearEstimatedEffort: PropTypes.func,
  onChangeEstimatedEffort: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSetInputRef: PropTypes.func,
  onClickOutside: PropTypes.func,
  renderTargetComponent: PropTypes.func.isRequired,
};

CardEstimatedEffortController.defaultProps = {
  isControllerOpen: false,
  isTaskEstimatedEffortExists: false,
  taskEstimatedEffort: '',
  onControllerClick: doNothing,
  onSetIsControllerOpen: doNothing,
  onClearEstimatedEffort: doNothing,
  onChangeEstimatedEffort: doNothing,
  onBlur: doNothing,
  onKeyDown: doNothing,
  onSetInputRef: doNothing,
  onClickOutside: doNothing,
  renderTargetComponent: doNothing,
};

function CardEstimatedEffortController(props) {
  const { t } = useTranslation();

  if (props?.hideOnEmpty && !props.taskEstimatedEffort) {
    return null;
  }

  return renderPopover(props, t);
}

function renderPopover(props, t) {
  return (
    <PopoverContent onClickOutside={props.onClickOutside} isVisible={props.isControllerOpen}>
      <UniversalPopover
        isPopoverOpened={props.isControllerOpen}
        popperContentWrapperClassName={styles.popoverContent}
        targetComponent={props.renderTargetComponent(props)}
        popperComponent={renderPopoverContent(props, t)}
        popperPlacement={'bottom'}
        popperModifiers={{
          offset: {
            offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 2}`,
          },
        }}
      />{' '}
    </PopoverContent>
  );
}

function renderPopoverContent(props, t) {
  return (
    <div className={styles.editor}>
      <UserInput
        placeholder={t('type points e.g. 2')}
        value={props.localTaskEstimatedEffort}
        onChange={props.onChangeEstimatedEffort}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        onSetInnerRef={props.onSetInputRef}
        type={'number'}
      />
      <SecondaryButton color={props.color} className={styles.buttonClear} onClick={props.onClearEstimatedEffort}>
        <span>{t('Clear')}</span>
      </SecondaryButton>
    </div>
  );
}

export default memo(CardEstimatedEffortController);

import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';

import { Pen } from 'commonComponents/Icons/fontawesome/Pen';
import InfoTooltip from 'commonComponents/InfoTooltip';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UserInput from 'commonComponents/UserInput';
import { i18mark, useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';
import styles from './styles.css';

WorkspaceNameInput.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,

  workspaceName: PropTypes.string,
  placeholder: PropTypes.string,
  isHovering: PropTypes.bool,
  isDisabled: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string,
  autoFocus: PropTypes.bool,

  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onUpdate: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

WorkspaceNameInput.defaultProps = {
  workspaceName: '',
  placeholder: i18mark('Company name'),
  isHovering: false,
  isDisabled: false,
  required: true,
  autoFocus: false,

  onFocus: doNothing,
  onBlur: doNothing,
  onKeyDown: doNothing,
  onKeyUp: doNothing,
  onUpdate: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

function WorkspaceNameInput(props) {
  const { t } = useTranslation();
  return props.isDisabled ? renderInputWithTooltip() : renderInput();

  function renderInput() {
    return (
      <UnderlinedInputWrapper className={styles.underlinedInput}>
        <UserInput
          className={props.className}
          innerClassName={props.innerClassName}
          type="text"
          name="name"
          value={props.workspaceName}
          isDisabled={props.isDisabled}
          required={props.required}
          label={props.label}
          placeholder={t(props.placeholder)}
          humanMessage={props.workspaceNameHumanMessageModel}
          autoFocus={props.autoFocus}
          onChange={props.onUpdate}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        />
        <Pen className={styles.inputPen} />
      </UnderlinedInputWrapper>
    );
  }

  function renderInputWithTooltip() {
    return (
      <InfoTooltip
        infoTooltipWrapperClassName={styles.infoTooltip}
        shouldRenderInfoTooltip={props.isHovering}
        popperPlacement={'top'}
        targetComponent={
          <div onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
            {renderInput()}
          </div>
        }
        popperModifiers={{
          offset: {
            offset: `0, ${commonStyles.gridCellSize}`,
          },
        }}
        title={t(`You have to be workspace owner to change name`)}
      />
    );
  }
}

export default WorkspaceNameInput;

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import ProgressSteps from 'commonComponents/ProgressSteps';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';

import styles from './styles.css';

NewWorkspaceForm.propTypes = {
  workspaceName: PropTypes.string,
  title: PropTypes.string,
  isSubmitting: PropTypes.bool,
  hideCancelButton: PropTypes.bool,
  workspaceNameHumanMessageModel: PropTypes.object,
  genericHumanMessageModel: PropTypes.object,

  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onWorkspaceNameChange: PropTypes.func,
  onSetInnerRef: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
};

NewWorkspaceForm.defaultProps = {
  workspaceName: '',
  title: '',
  isSubmitting: false,
  hideCancelButton: false,

  onSubmit: doNothing,
  onWorkspaceNameChange: doNothing,
  onSetInnerRef: doNothing,
  onKeyDown: doNothing,
  onBlur: doNothing,
};

function NewWorkspaceForm(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component} onKeyDown={props.onKeyDown}>
      {props.title && <div className={styles.header}>{t(props.title)}</div>}
      <div className={styles.tip}>
        {t(
          `Add your workspace name. For most people this is the name of their company. You can always change it later.`,
        )}
      </div>
      {renderForm()}
    </div>
  );

  function renderForm() {
    return (
      <form onSubmit={props.onSubmit} className={styles.form} noValidate>
        {renderWorkspaceName()}
        {renderFooter()}
      </form>
    );
  }

  function renderWorkspaceName() {
    return (
      <UnderlinedInputWrapper className={styles.inputWrapper}>
        <UserInput
          innerClassName={styles.workspaceNameInput}
          isDisabled={props.isSubmitting}
          placeholder={t('Name your workspace here')}
          type="text"
          name="name"
          value={props.workspaceName}
          onChange={props.onWorkspaceNameChange}
          onBlur={props.onBlur}
          humanMessage={props.workspaceNameHumanMessageModel || props.genericHumanMessageModel}
          humanMessageClassName={styles.errorMessage}
          onSetInnerRef={props.onSetInnerRef}
        />
      </UnderlinedInputWrapper>
    );
  }

  function renderFooter() {
    return (
      <>
        <footer className={styles.footer}>
          <ProgressSteps stepsCount={2} currentStep={1} />
          <div className={styles.buttonsWrapper}>
            {!props?.hideCancelButton && (
              <Button variant="text" onClick={props.onCancel}>
                {t('Cancel')}
              </Button>
            )}
            <Button type="submit" disabled={props.isSubmitting} className={styles.submitButton}>
              {`${props.isSubmitting ? t('Creating workspace...') : t('Create workspace')}`}
            </Button>
          </div>
        </footer>
      </>
    );
  }
}

export default NewWorkspaceForm;

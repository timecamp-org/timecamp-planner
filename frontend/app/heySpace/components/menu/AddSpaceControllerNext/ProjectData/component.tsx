import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import ProgressSteps from 'commonComponents/ProgressSteps/component';
import RadioButton from 'commonComponents/RadioButton';
import UnderlinedUserInput from 'commonComponents/UnderlinedUserInput';
import ProjectColors from 'commonStyles/projectColors';
import ProjectColorDot from 'components/projects/ProjectColorDot/component';
import { ProjectIconPicker } from 'components/projects/ProjectIconSettings';
import { i18mark, useTranslation } from 'i18n';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

import styles from './styles.css';

const forgottenNameError = HumanMessage({
  text: i18mark(`Looks like you forgot about name`),
  kind: HumanMessageKind.error,
});

AddSpaceController.propTypes = {
  projectName: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string,
  iconTyp: PropTypes.string,
  isPrivate: PropTypes.bool,
  isEmptyNameErrorVisible: PropTypes.bool,
  isPurposeInputVisible: PropTypes.bool,
  onUpdateColor: PropTypes.func,
  onUpdateIcon: PropTypes.func,
  onUpdateName: PropTypes.func,
  onUpdateIsPrivate: PropTypes.func,
  onSubmit: PropTypes.func,
  onUpdateDescription: PropTypes.func,
  onShowPurposeInput: PropTypes.func,
  onCancel: PropTypes.func,
  onSetInputRef: PropTypes.func,
  onKeyDown: PropTypes.func.isRequired,
};

AddSpaceController.defaultProps = {
  projectName: '',
  description: '',
  color: '',
  isPrivate: false,
  isEmptyNameErrorVisible: false,
  isPurposeInputVisible: false,
  onUpdateColor: doNothing,
  onUpdateIcon: doNothing,
  onUpdateName: doNothing,
  onUpdateIsPrivate: doNothing,
  onSubmit: doNothing,
  onUpdateDescription: doNothing,
  onShowPurposeInput: doNothing,
  onCancel: doNothing,
  onSetInputRef: doNothing,
  onKeyDown: doNothing,
};

function AddSpaceController(props) {
  const { t } = useTranslation();

  const onSetIsPublic = () => props.onUpdateIsPrivate(false);
  const onSetIsPrivate = () => props.onUpdateIsPrivate(true);

  return (
    <div className={styles.Component} onKeyDown={props.onKeyDown}>
      <UnderlinedUserInput
        value={props.projectName}
        placeholder={t('Name your project here')}
        humanMessage={props.isEmptyNameErrorVisible ? forgottenNameError : null}
        onChange={props.onUpdateName}
        onSetInnerRef={props.onSetInputRef}
        shouldFocusOnMount
      />
      <div className={styles.margin}>
        <textarea
          placeholder={t('Description or project goals (optional)')}
          onChange={props.onUpdateDescription}
          className={styles.textarea}
          value={props.description}
        />

        <section className={`${styles.section} ${styles.pickerSection}`}>
          <p className={styles.propertyName}>{t('PROJECT ICON:')}</p>
          <ProjectIconPicker iconType={props.iconType} onIconChange={props.onUpdateIcon} />
        </section>

        <section className={`${styles.pickerSection} ${styles.section}`}>
          <p className={styles.propertyName}>{t('COLOR:')}</p>
          <div className={styles.colorOptions}>
            {ProjectColors.getProjectColors().map((color) => renderColorDot(color, props))}
          </div>
        </section>

        <section className={`${styles.section}`}>
          <div className={styles.subtitle}>{t('PRIVACY MODE:')}</div>

          <div className={styles.radioButton}>
            <RadioButton label={t('Public ')} isChecked={!props.isPrivate} onClick={onSetIsPublic} />
            <div className={styles.description}>
              {t('seen by everyone in the workspace, but editing allowed only for project team, everyone can join')}
            </div>
          </div>
          <div className={styles.radioButton}>
            <RadioButton label={t('Private')} isChecked={props.isPrivate} onClick={onSetIsPrivate} />
            <div className={styles.description}>
              {t('seen and edited only by project team, only invited people can join')}
            </div>
          </div>
        </section>

        <ProgressSteps currentStep={1} stepsCount={2} />

        <footer className={styles.footer}>
          <Button variant="text" onClick={props.onCancel}>
            {t('Cancel')}
          </Button>
          <Button variant="contained" onClick={props.onSubmit}>
            {t('Next')}
          </Button>
        </footer>
      </div>
    </div>
  );
}

function renderColorDot(color, props) {
  const isSelected = color === props.color;

  return (
    <div
      key={color}
      onClick={() => props.onUpdateColor(color)}
      className={`${styles.projectSettingsButton} ${isSelected ? styles.selectedSettingsButton : ''}`}
    >
      <ProjectColorDot
        className={styles.colorDot}
        innerClassName={styles.innerDot}
        projectColor={color}
        projectId={''}
        disabled={!props.isEdit}
        shouldRenderInnerRing={false}
      />
    </div>
  );
}

export default AddSpaceController;

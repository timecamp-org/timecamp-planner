import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import RadioButton from 'commonComponents/RadioButton';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UserInput from 'commonComponents/UserInput';
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
  color: PropTypes.string,
  iconTyp: PropTypes.string,
  isPrivate: PropTypes.bool,
  isEmptyNameErrorVisible: PropTypes.bool,
  isPurposeInputVisible: PropTypes.bool,
  onUpdateColor: PropTypes.func,
  onUpdateIcon: PropTypes.func,
  onUpdateName: PropTypes.func,
  onUpdateIsPrivate: PropTypes.func,
  onAddSpace: PropTypes.func,
  onUpdatePurpose: PropTypes.func,
  onShowPurposeInput: PropTypes.func,
  onHideModal: PropTypes.func,
  onSetInputRef: PropTypes.func,
  onKeyDown: PropTypes.func.isRequired,
};

AddSpaceController.defaultProps = {
  projectName: '',
  color: '',
  isPrivate: false,
  isEmptyNameErrorVisible: false,
  isPurposeInputVisible: false,
  onUpdateColor: doNothing,
  onUpdateIcon: doNothing,
  onUpdateName: doNothing,
  onUpdateIsPrivate: doNothing,
  onAddSpace: doNothing,
  onUpdatePurpose: doNothing,
  onShowPurposeInput: doNothing,
  onHideModal: doNothing,
  onSetInputRef: doNothing,
  onKeyDown: doNothing,
};

function AddSpaceController(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component} onKeyDown={props.onKeyDown}>
      <UnderlinedInputWrapper>
        <UserInput
          className={styles.userInput}
          projectId={props.objectId}
          value={props.projectName}
          placeholder={t('Name your project here')}
          humanMessage={props.isEmptyNameErrorVisible ? forgottenNameError : null}
          onChange={props.onUpdateName}
          onSetInnerRef={props.onSetInputRef}
        />
      </UnderlinedInputWrapper>

      <div className={styles.margin}>
        <textarea
          placeholder={t('Description or project goals (optional)')}
          onChange={props.onUpdatePurpose}
          className={styles.textarea}
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
            <RadioButton
              label={t('Public ')}
              isChecked={!props.isPrivate}
              onClick={() => props.onUpdateIsPrivate(false)}
            />
            <div className={styles.description}>
              {t('seen by everyone in the workspace, but editing allowed only for project team, everyone can join')}
            </div>
          </div>
          <div className={styles.radioButton}>
            <RadioButton
              label={t('Private')}
              isChecked={props.isPrivate}
              onClick={() => props.onUpdateIsPrivate(true)}
            />
            <div className={styles.description}>
              {t('seen and edited only by project team, only invited people can join')}
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <Button variant="text" onClick={props.onHideModal}>
            {t('Cancel')}
          </Button>
          <Button variant="contained" onClick={props.onAddSpace}>
            {t('Create project')}
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

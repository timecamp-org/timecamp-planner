import { doNothing } from 'common/utils';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import { EnabledStatus } from 'models/domain/ExtensionsModel/types';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import styles from './styles.css';

import Checkbox from 'commonComponents/Checkbox';
import { MoreVertical } from 'commonComponents/Icons';
import RadioButton from 'commonComponents/RadioButton';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ProjectName from 'components/projects/projectName/ProjectName';
import { useTranslation } from 'i18n';

ExtensionItemSettings.propTypes = {
  className: PropTypes.string,
  spaceIds: ImmutablePropTypes.list,
  spaceEnabledExtensions: ImmutablePropTypes.map,
  isExtensionEnabledInOrganization: PropTypes.bool,
  extensionEnabledStatus: PropTypes.string,
  onSetExtensionEnabledStatus: PropTypes.func,
  onSetIsExtensionEnabledForSpace: PropTypes.func,
};

ExtensionItemSettings.defaultProps = {
  spaceIds: new List(),
  spaceEnabledExtensions: new Map(),
  isExtensionEnabledInOrganization: false,
  extensionEnabledStatus: EnabledStatus.ENABLE_FOR_ALL_SPACES,
  onSetExtensionEnabledStatus: doNothing,
  onSetIsExtensionEnabledForSpace: doNothing,
};

function ExtensionItemSettings(props) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetClassName={props.className}
      targetComponent={props.isExtensionEnabledInOrganization ? renderMoreVerticalButton(props) : <div></div>}
      popperComponent={renderExtensionSettingDropdown(props)}
      popperPlacement={'bottom'}
    />
  );
}

function renderExtensionSettingDropdown(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.dropdown}>
      <div className={styles.title}>{t('Enable for')}</div>
      <div className={styles.separator} />
      <SecondaryButton
        className={styles.radioItem}
        onClick={() => props.onSetExtensionEnabledStatus(EnabledStatus.ENABLE_FOR_ALL_SPACES)}
      >
        <RadioButton
          isChecked={props.extensionEnabledStatus === EnabledStatus.ENABLE_FOR_ALL_SPACES}
          className={styles.radioOption}
        />
        <span className={styles.optionLabel}>{t('All projects')}</span>
      </SecondaryButton>
      <SecondaryButton
        className={styles.radioItem}
        onClick={() => props.onSetExtensionEnabledStatus(EnabledStatus.ENABLE_FOR_SPECIFIC_SPACES)}
      >
        <RadioButton
          isChecked={props.extensionEnabledStatus === EnabledStatus.ENABLE_FOR_SPECIFIC_SPACES}
          className={styles.radioOption}
        />
        <span className={styles.optionLabel}>{t('Specific projects')}</span>
      </SecondaryButton>
      {props.extensionEnabledStatus === EnabledStatus.ENABLE_FOR_SPECIFIC_SPACES ? (
        <Fragment>
          <label htmlFor={'spacesList'} className={styles.spacesListLabel}>
            {t('Select projects: ')}
          </label>
          <div id={'spacesList'} className={styles.spacesList}>
            {props.spaceIds.map(renderSpaceOption)}
          </div>
        </Fragment>
      ) : null}
    </div>
  );

  function renderSpaceOption(projectId) {
    const isExtensionEnabledInSpace = props.spaceEnabledExtensions.get(projectId);
    return (
      <div
        className={styles.spaceItem}
        key={projectId}
        onClick={() => props.onSetIsExtensionEnabledForSpace(projectId, !isExtensionEnabledInSpace)}
      >
        <Checkbox isChecked={isExtensionEnabledInSpace} />
        <ProjectName className={styles.spaceLabel} projectId={projectId} />
      </div>
    );
  }
}

function renderMoreVerticalButton(props) {
  return (
    <SecondaryButton onClick={() => props.onSetIsPopoverOpened(!props.isPopoverOpened)}>
      <MoreVertical />
    </SecondaryButton>
  );
}

export default ExtensionItemSettings;

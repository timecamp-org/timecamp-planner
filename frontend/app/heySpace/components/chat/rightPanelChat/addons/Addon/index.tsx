import React from 'react';

import { Id } from 'common/utils/identifier';
import MaterialSwitch from 'commonComponents/MaterialSwitch/component';
import { useTranslation } from 'i18n';

import { useComponent } from './hook';
import styles from './styles.css';

export interface AddonInterface {
  extensionId: Id;
  projectId: Id;
}

export const Addon: React.FC<AddonInterface> = (props) => {
  const { name, description, isEnabled, isEnabledForAllSpaces, projectColor, onToggleExtensionEnabled } =
    useComponent(props);

  const { t } = useTranslation();

  return (
    <div className={styles.addon}>
      <div className={styles.title}>{t(name)}</div>
      <div className={styles.description}>{t(description)}</div>
      <div className={styles.switchWrapper}>
        <MaterialSwitch
          isChecked={isEnabled || isEnabledForAllSpaces}
          onClick={onToggleExtensionEnabled}
          color={projectColor}
        />
        {isEnabledForAllSpaces && <span>{t('Enabled for all projects')}</span>}
      </div>
    </div>
  );
};

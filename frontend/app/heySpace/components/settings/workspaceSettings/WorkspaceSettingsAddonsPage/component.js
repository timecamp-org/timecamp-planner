import AvailableApps from 'components/extensions/AvailableApps';
import ExtensionList from 'components/extensions/ExtensionList';
import OAuth1AuthorizedDataImportController from 'components/extensions/OAuth1AuthorizedDataImportController';
import { useTranslation } from 'i18n';
import { ExtensionType } from 'models/domain/ExtensionsModel/types';

import styles from './styles.css';

WorkspaceSettingsAddonsPage.propTypes = {};

WorkspaceSettingsAddonsPage.defaultProps = {};

function WorkspaceSettingsAddonsPage(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.settingsRow}>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Planner Extras')}</div>
          <ExtensionList className={styles.extensions} type={ExtensionType.INTERNAL} />
        </div>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Integrations')}</div>
          <ExtensionList className={styles.extensions} type={ExtensionType.INTEGRATION} />
        </div>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Available Apps')}</div>
          <AvailableApps />
        </div>
      </div>
      <OAuth1AuthorizedDataImportController />
    </div>
  );
}

export default WorkspaceSettingsAddonsPage;

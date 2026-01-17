import { Button } from '@mui/material';
import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import useElementOpen from 'common/hooks/useElementOpen';
import LoadingDots from 'commonComponents/LoadingDots';
import CreateAppModal from 'components/settings/developerConsole/CreateAppModal';
import EditAppModal from 'components/settings/developerConsole/EditAppModal';
import MyApp from 'components/settings/developerConsole/MyApp';
import { useTranslation } from 'i18n';

import styles from './styles.css';

MyApps.propTypes = {
  className: PropTypes.string,
  appIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool,
};

MyApps.defaultProps = {
  className: '',
  appIds: new List(),
  isLoading: false,
};

function MyApps(props) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onToggleOpen } = useElementOpen(false);
  const shouldRenderEmptyApps = props.appIds.isEmpty() && !props.isLoading;

  return (
    <div className={styles.Component}>
      <span className={styles.header}>
        {t('My Apps')}
        <Button className={styles.createAppButton} onClick={onOpen}>
          {t('Create new app')}
        </Button>
      </span>
      <CreateAppModal isModalVisible={isOpen} onSetIsModalOpen={onToggleOpen} />
      <EditAppModal />
      {shouldRenderEmptyApps ? renderEmptyApps(t) : renderAppList(props)}
    </div>
  );
}

function renderAppList(props) {
  return (
    <div className={styles.appsContainer}>
      {props.appIds.map(renderApp)}
      {props.isLoading && renderLoadingDots()}
    </div>
  );
}

function renderApp(appId) {
  return <MyApp appId={appId} key={appId} />;
}

function renderEmptyApps(t) {
  return <div className={styles.emptyList}>{t('You haven’t added any apps yet.')}</div>;
}

function renderLoadingDots() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots shouldRenderAsGif />
    </div>
  );
}
export default MyApps;

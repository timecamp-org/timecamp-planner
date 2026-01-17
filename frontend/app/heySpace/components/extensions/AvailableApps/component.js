import { Button } from '@mui/material';
import { List } from 'immutable';
import ImmutalblePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { useTranslation } from 'i18n';
import availableApps from 'models/domain/ExtensionsModel/constants/availableApps';

import styles from './styles.css';
import { TimecampTimerSettings } from './TimecampTimerSetings';

AvailableApps.propTypes = {
  className: PropTypes.string,
  extensionIds: ImmutalblePropTypes.list,
};

AvailableApps.defaultProps = {
  extensionIds: new List(),
};

function AvailableApps(props) {
  const { t } = useTranslation();

  return <div className={props.className || styles.Component}>{availableApps.map(renderApp)}</div>;

  function renderApp(app) {
    return (
      <div key={app.name} className={styles.app}>
        <div className={styles.title}>
          <div className={styles.imageWrapper}>
            {typeof app.icon === 'string' ? renderIcon(app.icon) : renderSvg(app.icon)}
          </div>
          <div className={styles.nameRow}>
            <span>{app.name}</span>
            {renderTimecampSettings(app)}
          </div>
        </div>
        <div className={styles.description}>{t(app.description)}</div>
        <Button className={styles.button} onClick={() => window.open(app.link)}>
          {t(`Go to {{name}}`, { name: app.name })}
        </Button>
      </div>
    );
  }
}

function renderIcon(icon) {
  return <img src={icon} className={styles.iconImage} />;
}

function renderSvg(Svg) {
  return (
    <span className={styles.iconImage}>
      <Svg />
    </span>
  );
}

function renderTimecampSettings(app) {
  return (
    app.name === 'TimeCamp' && (
      <div className={styles.timecampTimerSettings}>
        <TimecampTimerSettings />
      </div>
    )
  );
}

export default AvailableApps;

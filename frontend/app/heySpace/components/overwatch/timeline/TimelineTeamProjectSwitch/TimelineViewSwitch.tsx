import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

import { useTranslation } from 'i18n';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

import styles from './styles.css';

const activeStyle = {
  background: 'var(--color-primary-500)',
  color: 'var(--color-white)',
};

export const TimelineViewSwitch = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className={styles.wrapper}>
      <NavLink
        to={replacePanelType(pathname, ProjectPanelType.TIMELINE_PROJECT)}
        activeStyle={activeStyle}
        className={styles.link}
      >
        {t('Project')}
      </NavLink>

      <NavLink
        to={replacePanelType(pathname, ProjectPanelType.TIMELINE_PEOPLE)}
        activeStyle={activeStyle}
        className={styles.link}
      >
        {t('People')}
      </NavLink>
    </div>
  );
};

const PANEL_TYPE_REGEXP = RegExp(
  `${ProjectPanelType.TIMELINE_PROJECT}|${ProjectPanelType.TIMELINE_PEOPLE}|${ProjectPanelType.TIMELINE}`,
  'g'
);
const replacePanelType = (path: string, panelType?: ProjectPanelType) =>
  path.replace(PANEL_TYPE_REGEXP, panelType || '');

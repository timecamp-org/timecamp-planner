import { useParams } from 'react-router';

import NavTabs from 'commonComponents/NavTabs';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

import styles from '../../styles.css';
import { LeftPanelIconType } from '../../types';

import { convertLeftPanelLinks } from './convertLeftPanelLinks';

type LeftPanelLinksProps = {
  leftPanelLinks: LeftPanelIconType[];
};

const convertPanelTabToNav = (projectPanelType: ProjectPanelType) => {
  if ([ProjectPanelType.TIMELINE_PROJECT, ProjectPanelType.TIMELINE_PEOPLE].includes(projectPanelType)) {
    return ProjectPanelType.TIMELINE;
  }

  return projectPanelType;
};

const LeftPanelLinks = ({ leftPanelLinks }: LeftPanelLinksProps) => {
  const convertedLeftPanelLinks = convertLeftPanelLinks({ leftPanelLinks });

  const { projectPanelType: selectedTab } = useParams<{ projectPanelType: ProjectPanelType }>();

  return (
    <div className={styles.navigation}>
      <NavTabs tabs={convertedLeftPanelLinks} selectedTab={convertPanelTabToNav(selectedTab)} />
    </div>
  );
};

export default LeftPanelLinks;

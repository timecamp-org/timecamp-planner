import { useTranslation } from 'i18n';
import { RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import getSpaceUrl from 'utils/getSpaceUrl';

import styles from '../../styles.css';

import { Gear } from 'commonComponents/Icons/fontawesome/Gear';
import { Puzzle } from 'commonComponents/Icons/fontawesome/Puzzle';
import { User } from 'commonComponents/Icons/fontawesome/User';

export const useSpaceRightPanelLinks = (props) => {
  const { t } = useTranslation();

  const spaceRightPanelLinks = [
    {
      onClick: props.onOpenRightPanelChat,
      isActive: props.isRightPanelActive(RightPanelType.SETTINGS),
      color: props.projectColor,
      to: getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.SETTINGS),
      message: t('Settings'),
      icon: <Gear className={props.isRightPanelActive(RightPanelType.SETTINGS) ? styles.navLinkActive : ''} />,
    },
    {
      onClick: props.onOpenRightPanelChat,
      isActive: props.isRightPanelActive(RightPanelType.MEMBERS),
      color: props.projectColor,
      to: getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.MEMBERS),
      message: t('Members'),
      icon: (
        <div className={styles.linkContent}>
          <User
            className={props.isRightPanelActive(RightPanelType.MEMBERS) ? styles.membersIconActive : styles.membersIcon}
          />
          <span
            className={props.isRightPanelActive(RightPanelType.MEMBERS) ? styles.membersIconActive : styles.membersIcon}
          >
            {props.projectPeopleSize}
          </span>
        </div>
      ),
    },
    {
      onClick: props.onOpenRightPanelChat,
      isActive: props.isRightPanelActive(RightPanelType.ADDONS),
      color: props.projectColor,
      to: getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.ADDONS),
      message: t('Addons'),
      icon: (
        <div className={styles.linkContent}>
          <Puzzle className={props.isRightPanelActive(RightPanelType.ADDONS) ? styles.navLinkActive : ''} />
        </div>
      ),
    },
  ];

  return spaceRightPanelLinks;
};

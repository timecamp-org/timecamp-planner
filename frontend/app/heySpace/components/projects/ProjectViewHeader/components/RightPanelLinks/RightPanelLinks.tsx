import RightPanelLink from '../../components/RightPanelLink/RightPanelLink';
import styles from '../../styles.css';
import { RightPanelIconType } from '../../types';
import { isFunctionComponent } from '../../utils/isFunctionComponent';

const RightPanelLinks = ({ rightPanelLinks }: {rightPanelLinks: Array<RightPanelIconType>}) => {

  return (
    <div className={styles.panelFlexWrapper}>
        
      {rightPanelLinks.map((RightPanelLinkOrComponent, index) => {
        
        if (isFunctionComponent(RightPanelLinkOrComponent)) {
          return <RightPanelLinkOrComponent key={index} />;
        }

        const { color, icon, isActive, message, onClick, to } = RightPanelLinkOrComponent;

        return (
          <RightPanelLink color={color} isActive={isActive} message={message} onClick={onClick} to={to} key={index}>
            {icon}
          </RightPanelLink>
        );
      })}



    </div>
  );
};

export default RightPanelLinks;

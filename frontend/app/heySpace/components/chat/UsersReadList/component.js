import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InfoTooltip from 'commonComponents/InfoTooltip';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

const avatarSize = 15;

UsersReadList.propTypes = {
  userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
};

UsersReadList.defaultProps = {
  userIds: new List(),
};

function UsersReadList(props) {
  return <div className={styles.Component}>{props.userIds.map(renderReaction)}</div>;

  function renderReaction(userId) {
    return (
      <div className={styles.userReadBall} key={`InfoTip_${userId}`}>
        <InfoTooltip
          shouldRenderInfoTooltip={props.hoveredUserId === userId}
          infoTooltipWrapperClassName={styles.infoTooltip}
          popperPlacement={'top'}
          transitionDuration={0}
          targetComponent={
            <div onMouseEnter={() => props.onHoverUser(userId)} onMouseLeave={props.onLeaveUser}>
              <PersonIcon userId={userId} showOnlineIndicator={false} wrapperClassName={styles.avatar} />
            </div>
          }
          popperModifiers={{
            offset: {
              offset: `0, ${commonStyles.gridCellSize}`,
            },
          }}
          title={<PersonFullName userId={userId} />}
        />
      </div>
    );
  }
}

export default UsersReadList;

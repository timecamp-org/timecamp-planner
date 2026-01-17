import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import FollowObjectController from 'commonComponents/FollowObjectController';
import InfoTooltip from 'commonComponents/InfoTooltip';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

FollowTaskController.propTypes = {
  shouldRenderFollowingSwitcherInfoTooltip: PropTypes.bool,
  followingSwitcherInfoTooltipText: PropTypes.string,
  onMouseEnterFollowingController: PropTypes.func,
  onMouseLeaveFollowingController: PropTypes.func,
};

FollowTaskController.defaultProps = {
  shouldRenderFollowingSwitcherInfoTooltip: false,
  followingSwitcherInfoTooltipText: '',
  onMouseEnterFollowingController: doNothing,
  onMouseLeaveFollowingController: doNothing,
};

function FollowTaskController(props) {
  return (
    <div onMouseEnter={props.onMouseEnterFollowingController} onMouseLeave={props.onMouseLeaveFollowingController}>
      <InfoTooltip
        infoTooltipWrapperClassName={styles.followingControllerInfoTooltipWrapperClassName}
        shouldRenderInfoTooltip={props.shouldRenderFollowingSwitcherInfoTooltip}
        targetComponent={<FollowObjectController {...props} />}
        popperPlacement={'bottom'}
        popperModifiers={{
          offset: {
            offset: `0, ${commonStyles.gridCellSize}`,
          },
        }}
        title={props.followingSwitcherInfoTooltipText}
      />
    </div>
  );
}

export default FollowTaskController;

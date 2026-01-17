import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import InfoTooltip from 'commonComponents/InfoTooltip';
import { useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';

import TaskProgressEstimateEditable from '../TaskProgressEstimateEditable';

import styles from './styles.css';

TaskProgressEstimate.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  taskId: PropTypes.string.isRequired,
  shouldRenderInfoTooltip: PropTypes.bool,
  onMouseEnterProgressBar: PropTypes.func,
  onMouseLeaveProgressBar: PropTypes.func,
  onChangeTaskProgressCallback: PropTypes.func,
};

TaskProgressEstimate.defaultProps = {
  shouldRenderInfoTooltip: true,
  onChangeTaskProgressCallback: doNothing,
};

function TaskProgressEstimate(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.component}>
      <InfoTooltip
        shouldRenderInfoTooltip={props.shouldRenderInfoTooltip}
        targetComponent={
          <TaskProgressEstimateEditable
            taskId={props.taskId}
            className={props.innerClassName}
            onMouseEnterProgressBar={props.onMouseEnterProgressBar}
            onMouseLeaveProgressBar={props.onMouseLeaveProgressBar}
            onChangeTaskProgressCallback={props.onChangeTaskProgressCallback}
          />
        }
        popperPlacement={'top'}
        popperModifiers={{
          offset: {
            offset: `0, ${commonStyles.gridCellSize}`,
          },
        }}
        title={t('Task progress')}
        message={t('Team members can mark percentage progress of a task completion')}
      />
    </div>
  );
}

export default TaskProgressEstimate;

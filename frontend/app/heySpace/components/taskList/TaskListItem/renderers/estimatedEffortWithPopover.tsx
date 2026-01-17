import { Points } from 'commonComponents/Icons';
import InfoTooltip from 'commonComponents/InfoTooltip';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import { PropertyButton } from 'components/buttons/PropertyButton';
import CardEstimatedEffortController from 'components/tasks/CardEstimatedEffortController';
import { i18n } from 'i18n';
import { getConditionalClass } from 'utils/getConditionalClass';

import { PureCardInterface } from '..';
import styles from '../styles.css';

const TRANSITION_DURATION = 100;

export function renderEstimatedEffortWithPopover(props: PureCardInterface) {
  return (
    <StopClickEventPropagation>
      <CardEstimatedEffortController
        taskId={props.taskId}
        // @ts-ignore
        renderTargetComponent={renderEstimatedEffort}
        isHoveringEfforts={props.isHoveringEfforts}
        onEstimatedEffortsEnter={props.onEstimatedEffortsEnter}
        onEstimatedEffortsLeave={props.onEstimatedEffortsLeave}
      />
    </StopClickEventPropagation>
  );
}

function renderEstimatedEffort(targetProps) {
  return (
    <InfoTooltip
      shouldRenderInfoTooltip={targetProps.isHoveringEfforts}
      transitionDuration={TRANSITION_DURATION}
      popperPlacement={'top'}
      targetComponent={renderEstimatedEffortTarget(targetProps)}
      title={i18n.t('Points')}
      message={i18n.t(`Estimated effort: {{estimatedEffort}}`, {
        estimatedEffort: targetProps.taskEstimatedEffort,
      })}
    />
  );
}

function renderEstimatedEffortTarget(targetProps) {
  return (
    <PropertyButton
      className={`${getConditionalClass(
        styles.taskEstimatedEffort,
        targetProps.taskEstimatedEffort
      )} ${getConditionalClass(styles.emptyPropertyButtonSize, !targetProps.taskEstimatedEffort)}`}
      onClick={() => targetProps.onSetIsControllerOpen(!targetProps.isControllerOpen)}
      isActive={targetProps.isControllerOpen}
      onMouseEnter={targetProps.onEstimatedEffortsEnter}
      onMouseLeave={targetProps.onEstimatedEffortsLeave}
      icon={<Points className={styles.icon} />}
      hasProperty={targetProps.taskEstimatedEffort}
    >
      <span>{targetProps.taskEstimatedEffort}</span>
    </PropertyButton>
  );
}

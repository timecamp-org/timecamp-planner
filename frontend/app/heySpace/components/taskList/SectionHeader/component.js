import { memo } from 'react';

import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing, ellipsizeInTheEnd } from 'common/utils';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import { Points } from 'commonComponents/Icons';
import { Eye } from 'commonComponents/Icons/fontawesome/Eye';
import InfoTooltip from 'commonComponents/InfoTooltip';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import SectionNameIO from 'components/taskList/SectionNameIO';
import SectionOptions from 'components/taskList/SectionOptions';
import useOnHover from 'hooks/useOnHover';
import { useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';

const transitionDuration = 100;
const emptyList = new List();

import styles from './styles.css';

SectionHeader.propTypes = {
  className: PropTypes.string,
  sectionId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string,
  cardsCount: PropTypes.number,
  listFilteredEstimatedEffort: PropTypes.number,
  listEstimatedEffort: PropTypes.number,
  shouldRenderProjectIcon: PropTypes.bool,
  shouldDisplayFilteredEstimate: PropTypes.bool,
  isUserFollowingList: PropTypes.bool,
  hasAccessToEstimates: PropTypes.bool,
  isEstimatesExtensionEnabled: PropTypes.bool,
  sectionOptions: ImmutablePropTypes.list,
  onAddCard: PropTypes.func,
};

SectionHeader.defaultProps = {
  className: '',
  projectName: '',
  cardsCount: 0,
  listFilteredEstimatedEffort: 0,
  listEstimatedEffort: 0,
  shouldRenderProjectIcon: false,
  shouldDisplayFilteredEstimate: false,
  isUserFollowingList: false,
  hasAccessToEstimates: false,
  isEstimatesExtensionEnabled: false,
  sectionOptions: emptyList,
  onAddCard: doNothing,
};

function SectionHeader(props) {
  const { t } = useTranslation();
  const {
    isHovering: isHoveringProjectIcon,
    onMouseEnter: onProjectIconEnter,
    onMouseLeave: onProjectIconLeave,
  } = useOnHover(false);
  const {
    isHovering: isHoveringEstimate,
    onMouseEnter: onEstimateEnter,
    onMouseLeave: onEstimateLeave,
  } = useOnHover(false);
  const shouldRenderEstimates =
    props.isEstimatesExtensionEnabled && props.listEstimatedEffort > 0 && props.hasAccessToEstimates;

  return (
    <div className={props.className || styles.Component}>
      {props.shouldRenderProjectIcon && (
        <InfoTooltip
          infoTooltipWrapperClassName={styles.infoTooltip}
          popperPlacement={'top'}
          transitionDuration={transitionDuration}
          targetComponent={renderProjectIcon(props, onProjectIconEnter, onProjectIconLeave)}
          message={props.projectName}
          shouldRenderInfoTooltip={isHoveringProjectIcon}
          messageClassName={styles.infoTooltipProjectName}
          popperModifiers={{
            offset: {
              offset: `0, ${commonStyles.gridCellSize}`,
            },
          }}
        />
      )}
      <TooltipedHoveredComponent
        popperPlacement={'top'}
        className={styles.sectionName}
        message={`${props.cardsCount} ${t(' card_count', {
          count: props.cardsCount,
        })}`}
      >
        <SectionNameIO sectionId={props.sectionId} className={styles.sectionNameIO} />
      </TooltipedHoveredComponent>
      {props.isUserFollowingList && <Eye width={16} height={10} className={styles.followingIcon} />}
      {shouldRenderEstimates &&
        renderWrappedEstimateEffort(props, isHoveringEstimate, onEstimateEnter, onEstimateLeave, t)}
      <SectionOptions
        sectionId={props.sectionId}
        userId={props.userId}
        sectionOptions={props.sectionOptions}
        onAddCard={props.onAddCard}
      />
    </div>
  );
}

function renderProjectIcon(props, onProjectIconEnter, onProjectIconLeave) {
  return (
    <div onMouseEnter={onProjectIconEnter} onMouseLeave={onProjectIconLeave} className={styles.projectIcon}>
      <ColoredProjectIcon projectId={props.projectId} />
    </div>
  );
}

function renderWrappedEstimateEffort(props, isHoveringEstimate, onEstimateEnter, onEstimateLeave, t) {
  return (
    <InfoTooltip
      shouldRenderInfoTooltip={isHoveringEstimate}
      infoTooltipWrapperClassName={styles.infoTooltip}
      popperPlacement={'top'}
      transitionDuration={transitionDuration}
      targetComponent={renderEstimates(props, onEstimateEnter, onEstimateLeave)}
      title={t('Points')}
      message={t(`Filtered: {{listFilteredEstimatedEffort}} \n All: {{listEstimatedEffort}}`, {
        listFilteredEstimatedEffort: props.listFilteredEstimatedEffort,
        listEstimatedEffort: props.listEstimatedEffort,
      })}
    />
  );
}

function renderEstimates(props, onEstimateEnter, onEstimateLeave) {
  const estimate = props.shouldDisplayFilteredEstimate
    ? `${props.listFilteredEstimatedEffort}/${props.listEstimatedEffort}`
    : props.listEstimatedEffort.toString();

  return (
    <div className={styles.listEstimatedEffort} onMouseEnter={onEstimateEnter} onMouseLeave={onEstimateLeave}>
      <Points />
      <span>{ellipsizeInTheEnd(estimate.toString(), 9)}</span>
    </div>
  );
}

export default memo(SectionHeader);

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import EmptyState from 'commonAssets/emptyState/Empty_State_30.png';
import { Checkmark } from 'commonComponents/Icons';
import InfoTooltip from 'commonComponents/InfoTooltip';
import { i18mark, useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

const premiumFeaturesSimple = [
  i18mark('Calendar'),
  i18mark('Timeline'),
  i18mark('My Tasks'),
  i18mark('OverWatch'),
  i18mark('Planner'),
  i18mark('List view'),
  i18mark('Tags'),
  i18mark('Recurring tasks'),
  i18mark('Points'),
  i18mark('Video calls'),
  i18mark('Votes'),
];

SubscriptionDescription.propTypes = {
  isCurrentUserOrganizationAdmin: PropTypes.bool,
  isTrialAvailable: PropTypes.bool,

  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onNavigateToSubscriptions: PropTypes.func,
};

SubscriptionDescription.defaultProps = {
  isCurrentUserOrganizationAdmin: false,
  isTrialAvailable: false,

  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
  onNavigateToSubscriptions: doNothing,
};

function SubscriptionDescription(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className}>
      <div className={styles.title}>{t('What do you miss in the Free plan?')}</div>
      <div className={styles.description}>
        {t(
          `Planner is entirely free of charge, however if you want to implement some rocket science technology there, you can easily upgrade your account. Premium Plan will allow you to see tasks in board, calendar, timeline, OverWatch, MyTasks and list view. You can also add tags and estimates to tasks, make it recurring and use video calls. Upgrade now and enjoy all Premium features in Planner!`,
        )}
      </div>
      <div className={styles.mascotWithFeatures}>
        <img src={EmptyState} className={styles.mascot} />
        <div className={styles.features}>{premiumFeaturesSimple.map(renderFeatureRow)}</div>
      </div>
      {props.isFree
        ? props.isCurrentUserOrganizationAdmin
          ? renderUpgradeButton(props, t)
          : renderUpgradeButtonWithTooltip(props, t)
        : null}
    </div>
  );

  function renderFeatureRow(feature) {
    return (
      <div className={styles.feature} key={feature}>
        <Checkmark className={styles.checkmark} />
        {t(feature)}
      </div>
    );
  }
}

function renderUpgradeButton(props, t) {
  return (
    <div className={styles.upgradeButton} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      <Button
        className={styles.button}
        disabled={!props.isCurrentUserOrganizationAdmin}
        onClick={props.onNavigateToSubscriptions}
      >
        {props.isTrialAvailable ? t('Try out 14 days Premium trial') : 'UPGRADE'}
      </Button>
    </div>
  );
}

function renderUpgradeButtonWithTooltip(props, t) {
  return (
    <InfoTooltip
      infoTooltipWrapperClassName={styles.infoTooltip}
      targetWrapperClassName={styles.targetWrapperClassName}
      shouldRenderInfoTooltip={props.isHovering}
      popperPlacement={'top'}
      targetComponent={renderUpgradeButton(props, t)}
      popperModifiers={{
        offset: {
          offset: `0, ${commonStyles.gridCellSize}`,
        },
      }}
      title={t(`You have to be workspace owner to upgrade plan.`)}
    />
  );
}

export default SubscriptionDescription;

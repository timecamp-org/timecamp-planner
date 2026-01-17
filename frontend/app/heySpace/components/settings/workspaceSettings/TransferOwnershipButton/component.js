import { doNothing } from 'common/utils';
import { TransferArrow } from 'commonComponents/Icons';
import InfoTooltip from 'commonComponents/InfoTooltip';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import commonStyles from 'styles/common.css';
import styles from './styles.css';

TransferOwnershipButton.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  isHovering: PropTypes.bool.isRequired,

  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

TransferOwnershipButton.defaultProps = {
  isDisabled: false,
  isHovering: false,
  fullName: '',

  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

function TransferOwnershipButton(props) {
  const { t } = useTranslation();
  return <Fragment>{props.isDisabled ? renderButtonWithTooltip(props, t) : renderButton(props, t)}</Fragment>;
}

function renderButton(props, t) {
  return (
    <div className={styles.planActionButton} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      <SecondaryButton className={props.className} isDisabled={props.isDisabled} onClick={props.onClick}>
        <TransferArrow className={styles.icon} />
        {t('Transfer ownership')}
      </SecondaryButton>
    </div>
  );
}

function renderButtonWithTooltip(props, t) {
  return (
    <InfoTooltip
      infoTooltipWrapperClassName={styles.infoTooltip}
      shouldRenderInfoTooltip={props.isHovering}
      popperPlacement={'top'}
      targetComponent={renderButton(props, t)}
      popperModifiers={{
        offset: {
          offset: `0, ${commonStyles.gridCellSize}`,
        },
      }}
      title={t(`You cannot transfer ownership to the current owner of the workspace`)}
    />
  );
}

export default TransferOwnershipButton;

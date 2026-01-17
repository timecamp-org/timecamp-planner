import { doNothing } from 'common/utils';
import { Link } from 'commonComponents/Icons/fontawesome/Link';
import InfoTooltip from 'commonComponents/InfoTooltip';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import commonStyles from 'styles/common.css';
import styles from './styles.css';

GenerateInvitationLinkButton.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  isHovering: PropTypes.bool.isRequired,

  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

GenerateInvitationLinkButton.defaultProps = {
  isDisabled: false,
  isHovering: false,
  userEmail: '',

  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
  onClick: doNothing,
};

function GenerateInvitationLinkButton(props) {
  const { t } = useTranslation();
  return <Fragment>{props.isDisabled ? renderButtonWithTooltip(props, t) : renderButton(props, t)}</Fragment>;
}

function renderButton(props, t) {
  return (
    <div className={styles.planActionButton} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      <SecondaryButton className={props.className} isDisabled={props.isDisabled} onClick={props.onClick}>
        <Link className={styles.icon} />
        {t('Invitation link')}
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
      title={t(`You have to be workspace owner to generate invitation link`)}
    />
  );
}

export default GenerateInvitationLinkButton;

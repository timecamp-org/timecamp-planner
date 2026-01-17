import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import UniversalModal from 'commonComponents/UniversalModal';
import PaymentForm from 'components/subscription/PaymentForm';
import { useTranslation } from 'i18n';

import styles from './styles.css';

UpdateSubscriptionButton.propTypes = {
  className: PropTypes.string,
  isModalVisible: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isPaymentFormVisible: PropTypes.bool.isRequired,
  seatCountDiff: PropTypes.number,
  updatedCharge: PropTypes.number,

  onUpdateOrganizationSubscription: PropTypes.func.isRequired,
  onSetIsModalVisible: PropTypes.func.isRequired,
  onUpdateClick: PropTypes.func.isRequired,
  onStopUpdating: PropTypes.func.isRequired,
  onCheckoutStep: PropTypes.func.isRequired,
};

UpdateSubscriptionButton.defaultProps = {
  isModalVisible: false,
  isUpdating: false,
  isPaymentFormVisible: false,
  seatCountDiff: 0,
  updatedCharge: 0,

  onUpdateOrganizationSubscription: doNothing,
  onSetIsModalVisible: doNothing,
  onUpdateClick: doNothing,
  onStopUpdating: doNothing,
  onCheckoutStep: doNothing,
};

function UpdateSubscriptionButton(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Button className={props.className} disabled={props.isDisabled} onClick={props.onUpdateClick}>
        {props.isUpdating ? t('Updating...') : t('Update plan')}
      </Button>
      <UniversalModal
        isModalOpen={props.isModalVisible}
        backdropClassName={styles.backdrop}
        cancelButtonCaption={t('No')}
        saveButtonCaption={t('Yes')}
        header={t('Update subscription')}
        onModalSave={props.onUpdateOrganizationSubscription}
        onSetIsModalOpen={props.onSetIsModalVisible}
        shouldRenderCloseIcon={false}
        shouldFocusOnOpen={true}
      >
        {props.seatCountDiff >= 0 ? renderCaseMoreSeats(props) : renderCaseLessSeats()}
      </UniversalModal>
      {props.isPaymentFormVisible && (
        <PaymentForm
          onCheckoutClose={props.onStopUpdating}
          onCheckoutFailure={props.onStopUpdating}
          onCheckoutStep={props.onCheckoutStep}
        />
      )}
    </Fragment>
  );

  function renderCaseLessSeats() {
    return t(`Are you sure you want to downgrade subscription?`);
  }

  function renderCaseMoreSeats(props) {
    return t(
      'Are you sure you want to update subscription? You will be charged another ${{updatedCharge}} for additional {{count}} seats',
      {
        updatedCharge: props.updatedCharge?.toFixed(2),
        count: props.seatCountDiff,
      },
    );
  }
}

export default UpdateSubscriptionButton;

import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import CancelSubscriptionFeedbackModal from 'components/settings/userProfile/FeedbackModal/cancelSubscription';
import { useTranslation } from 'i18n';

CancelSubscriptionButton.propTypes = {
  className: PropTypes.string,
  cancellationRequestSent: PropTypes.bool.isRequired,
  isCancelModalVisible: PropTypes.bool.isRequired,

  onSetIsCancelModalVisible: PropTypes.func.isRequired,
  onToggleModalVisible: PropTypes.func.isRequired,
};

function CancelSubscriptionButton(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Button
        variant="text"
        className={props.className}
        disabled={props.isDisabled}
        onClick={props.onToggleModalVisible}
      >
        {props.cancellationRequestSent ? t('Subscription cancellation pending...') : t('Cancel Subscription')}
      </Button>
      <CancelSubscriptionFeedbackModal
        isModalOpen={props.isCancelModalVisible}
        onSetIsModalOpened={props.onSetIsCancelModalVisible}
      />
    </Fragment>
  );
}

export default CancelSubscriptionButton;

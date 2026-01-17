import React from 'react';
import DateOutput from 'components/date/DateOutput';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { getStatusDisplayName } from 'common/utils/payment';
import { CouponStatus } from 'models/domain/SubscriptionModel/types';
import { useTranslation } from 'i18n';

Coupon.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
  validUntil: PropTypes.number,
  code: PropTypes.string,
  discountAmount: PropTypes.number,
  discountPercentage: PropTypes.number,
  durationMonth: PropTypes.number,
};

Coupon.defaultProps = {
  name: '',
  code: '-',
  discountAmount: 0,
  discountPercentage: 0,
  durationMonth: 0,
};

export default function Coupon(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.Component}>
      <div className={styles.cell}>{props.name}</div>
      <div className={styles.cell}>{getDiscountAmount(props)}</div>
      {renderValidUntil(props, t)}
      <div className={styles.cell}>{props.code}</div>
      <div className={styles.cell}>{renderStatus(props)}</div>
    </div>
  );
}

function getDiscountAmount(props) {
  const amount = props.discountAmount / 100;
  if (!amount) {
    return `${props.discountPercentage}%`;
  }
  return `$${amount.toFixed(2)}`;
}

function renderValidUntil(props, t) {
  if (props.validUntil) {
    return (
      <DateOutput
        className={styles.cell}
        timestamp={props.validUntil}
        format={'MMM D, YYYY'}
      />
    );
  } else if (props.durationMonth) {
    return (
      <div className={styles.cell}>
        {t('{{count}} months', { count: props.durationMonth })}
      </div>
    );
  } else {
    return <div className={styles.cell}>{t('forever')}</div>;
  }
}

function renderStatus(props) {
  return (
    <div className={getStatusClass(props.status)}>
      {getStatusDisplayName(props.status)}
    </div>
  );
}

function getStatusClass(status) {
  switch (status) {
    case CouponStatus.ACTIVE:
      return styles.successfull;
    case CouponStatus.EXPIRED:
    case CouponStatus.ARCHIVED:
    case CouponStatus.DELETED:
      return styles.warn;
    default:
      return styles.failed;
  }
}

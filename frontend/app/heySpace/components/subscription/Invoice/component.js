import React from 'react';
import DateOutput from 'components/date/DateOutput';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import { getStatusDisplayName } from 'common/utils/payment';
import { InvoiceStatus } from 'models/domain/SubscriptionModel/types';
import { File } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';

Invoice.propTypes = {
  createdAt: PropTypes.number,
  planName: PropTypes.string,
  status: PropTypes.string,
  total: PropTypes.number,
  quantity: PropTypes.number,

  onDownloadInvoice: PropTypes.func,
};

Invoice.defaultProps = {
  planName: '',
  status: '',
  total: 0,
  quantity: 0,

  onDownloadInvoice: doNothing,
};

export default function Invoice(props) {
  return (
    <div className={props.className || styles.Component}>
      <DateOutput
        className={styles.cell}
        timestamp={props.createdAt}
        format={'MMM D, YYYY'}
      />
      <div className={styles.cell}>{getAmountPaid(props)}</div>
      <div className={styles.cell}>{props.quantity}</div>
      <div className={styles.longCell}>{props.planName}</div>
      <div className={styles.cell}>{renderStatus(props)}</div>
      <div className={styles.cell}>
        <SecondaryButton onClick={props.onDownloadInvoice}>
          <File />
        </SecondaryButton>
      </div>
    </div>
  );
}

function getAmountPaid(props) {
  const amount = props.total / 100;
  return `$${amount.toFixed(2)}`;
}

function renderStatus(props) {
  return (
    <div className={getInvoiceStatusClass(props.status)}>
      {getStatusDisplayName(props.status)}
    </div>
  );
}

function getInvoiceStatusClass(status) {
  switch (status) {
    case InvoiceStatus.PAID:
      return styles.successfull;
    case InvoiceStatus.POSTED:
    case InvoiceStatus.PAYMENT_DUE:
    case InvoiceStatus.PENDING:
      return styles.warn;
    default:
      return styles.failed;
  }
}

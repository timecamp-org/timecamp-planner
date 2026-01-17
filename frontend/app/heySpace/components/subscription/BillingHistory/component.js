import React, { Fragment } from 'react';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Invoice from 'components/subscription/Invoice';
import styles from './styles.css';

import LoadingDots from 'commonComponents/LoadingDots';
import { useTranslation } from 'i18n';

BillingHistory.propTypes = {
  invoiceIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool,
};

BillingHistory.defaultProps = {
  invoiceIds: new List(),
  isLoading: false,
};

function BillingHistory(props) {
  const { t } = useTranslation();
  return props.isLoading ? renderLoadingDots() : renderContent(props);

  function renderContent() {
    return props.invoiceIds.isEmpty() ? (
      <div>{t('You haven’t made any purchases yet.')}</div>
    ) : (
      renderInvoiceList(props.invoiceIds)
    );
  }

  function renderInvoiceList(invoiceIds) {
    return (
      <Fragment>
        {renderHeader()}
        {invoiceIds.map(renderInvoice)}
      </Fragment>
    );
  }

  function renderLoadingDots() {
    return (
      <div className={styles.loaderWrapper}>
        <LoadingDots className={styles.loadingDots} />
      </div>
    );
  }

  function renderHeader() {
    return (
      <div className={styles.header}>
        <div className={styles.cell}>{t('Date')}</div>
        <div className={styles.cell}>{t('Amount paid')}</div>
        <div className={styles.cell}>{t('Quantity')}</div>
        <div className={styles.longCell}>{t('Description')}</div>
        <div className={styles.cell}>{t('Status')}</div>
        <div className={styles.cell}>{t('Invoice')}</div>
      </div>
    );
  }

  function renderInvoice(invoiceId) {
    return (
      <Invoice
        className={styles.invoice}
        key={invoiceId}
        invoiceId={invoiceId}
      />
    );
  }
}

export default BillingHistory;

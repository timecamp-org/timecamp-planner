import React from 'react'
import PropTypes from 'prop-types'

PaymentForm.propTypes = {
  className: PropTypes.string,
}

function PaymentForm(props) { // eslint-disable-line react/prefer-stateless-function
  return (
    <div
      className={props.className}
      id={'payment-container'}
      ref={props.onSetRef}
    >
    </div>
  )
}

export default PaymentForm

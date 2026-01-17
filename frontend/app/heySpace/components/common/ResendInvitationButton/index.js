import React from 'react'
import PropTypes from 'prop-types'
import useResendInvitation from './useResendInvitation'

ResendInvitationButton.propTypes = {
  children: PropTypes.func.isRequired,
  conversationUserId: PropTypes.string.isRequired,
  shouldShowConfirmation: PropTypes.bool,
}

ResendInvitationButton.defaultProps = {
  shouldShowConfirmation: false,
}

function ResendInvitationButton(props) {
  const onClick = useResendInvitation({
    conversationUserId: props.conversationUserId,
    shouldShowConfirmation: props.shouldShowConfirmation,
  })

  return props.children(onClick)
}

export default ResendInvitationButton

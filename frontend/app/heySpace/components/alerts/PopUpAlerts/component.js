import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { doNothing } from 'common/utils'

import { List } from 'immutable'

import PopUpAlert from 'components/alerts/PopUpAlert'

PopUpAlerts.propTypes = {
  alertIds: ImmutablePropTypes.list,
  onClosePopUpAlert: PropTypes.func.isRequired,
}

PopUpAlerts.defaultProps = {
  alertIds: new List(),
  onClosePopUpAlert: doNothing,
}

function PopUpAlerts(props) {
  return (
    <div>
      { props.alertIds.map(renderAlert) }
    </div>
  )

  function renderAlert(alertId, index) {
    return (
      <PopUpAlert
        key={alertId}
        numberFromTop={index}
        alertId={alertId}
        onClosePopUpAlert={props.onClosePopUpAlert}
      />
    )
  }
}

export default PopUpAlerts

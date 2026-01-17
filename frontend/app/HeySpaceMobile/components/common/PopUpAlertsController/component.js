import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import DropdownAlert from 'react-native-dropdownalert'
import { coralPinkTwoColor, mangoColor, darkMintColor, dodgerBlueTwoColor } from 'common/commonStyles/colors'

const CLOSE_INTERVAL = 4000

PopUpAlertsController.propTypes = {
  onSetRef: PropTypes.func.isRequired,
}

PopUpAlertsController.defaultProps = {
  onSetRef: doNothing,
}

function PopUpAlertsController(props) {
  return (
    <DropdownAlert
      ref={props.onSetRef}
      showCancel={true}
      closeInterval={CLOSE_INTERVAL}
      successColor={darkMintColor}
      errorColor={coralPinkTwoColor}
      warnColor={mangoColor}
      infoColor={dodgerBlueTwoColor}
      updateStatusBar={false}
      useNativeDriver={true}
      zIndex={1000}
    />
  )
}

export default PopUpAlertsController

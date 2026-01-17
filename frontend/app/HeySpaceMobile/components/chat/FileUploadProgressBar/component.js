import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View } from 'react-native'
import ProgressBar from 'react-native-progress/Bar'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { whiteTwoColor } from 'common/commonStyles/colors'

FileUploadProgressBar.propTypes = {
  fileName: PropTypes.string,
  progressDisplay: PropTypes.number,
}

FileUploadProgressBar.defaultProps = {
  fileName: '',
  progressDisplay: 0,
}

function FileUploadProgressBar(props) {
  return (
    <View style={styles.container}>
      <ProgressBar
        progress={props.progressDisplay}
        width={wp('95%')}
        unfilledColor={whiteTwoColor}
      />
    </View>
  )
}

export default FileUploadProgressBar

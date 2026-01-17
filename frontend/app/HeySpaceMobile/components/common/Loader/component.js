import React from 'react'
import PropTypes from 'prop-types'
import { View, ActivityIndicator } from 'react-native'
import { wisteriaColor } from 'common/commonStyles/colors'

Loader.propTypes = {
  isLoading: PropTypes.bool,
  size: PropTypes.string,
  color: PropTypes.string,
}

Loader.defaultProps = {
  isLoading: true,
  size: 'large',
  color: wisteriaColor,
}

function Loader(props) {
  if (!props.isLoading) {
    return null
  }

  return props.containerStyles ? renderLoaderWithContainer() : renderLoader()
  
  function renderLoader() {
    return (
      <ActivityIndicator
        size={props.size}
        color={props.color}
      />
    )
  }

  function renderLoaderWithContainer() {
    return (
      <View style={props.containerStyles}>
        {renderLoader()}
      </View>
    )
  }
}

export default Loader


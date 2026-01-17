import React from 'react'
import { View, Text, Image } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

import handleError from '../../../../common/utils/handleError'

import BaseComponent from '../../../../common/enhancers/BaseComponent'
import PrimaryButton from '../../common/PrimaryButton'
import RNRestart from 'react-native-restart'

import Assets from '../../../../common/commonAssets'

class GlobalErrorBoundary extends BaseComponent {

  static propTypes = {
    appHasError: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    appHasError: false,
  }

  state = {
    hasError: false,
  }

  render() {
    if (this.state.hasError || this.props.appHasError) {
      return this.renderFallbackComponent()
    } else {
      return this.props.children
    }
  }

  renderFallbackComponent() {
    return (
      <View style={styles.component}>
        <View style={styles.top}>
          <Text style={styles.background}>{'500'}</Text>
          <Image
            source={{ uri: Assets.CHARACTER_9 }}
            style={styles.mascot}
            resizeMode={'contain'}
          />
        </View>
        <Text style={styles.title}>{`Houston, we have a problem!`}</Text>
        <Text style={styles.description}>{`Sorry, the view you are looking for is temporaily not available. Our team is working on it. Meanwile take a tour through our app.`}</Text>
        <PrimaryButton onPress={this.reloadApp} text={'Go to main page'} />
      </View>
    )
  }

  reloadApp() {
    RNRestart.Restart()
  }

  componentDidCatch(error, componentStackTrace) {
    this.setState({
      hasError: true,
    })
    handleError(error, { extra: componentStackTrace })
  }

}

export default GlobalErrorBoundary

import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Animated } from 'react-native'
import BaseComponent from 'BaseComponent'

class LoadingDots extends BaseComponent {

  static propTypes = {
    numberOfDots: PropTypes.number,
    animationDelay: PropTypes.number,
    minOpacity: PropTypes.number,
    style: PropTypes.object,
  }

  static defaultProps = {
    numberOfDots: 3,
    animationDelay: 300,
    minOpacity: 0,
    style: styles.defaultDotStyle,
  }

  initializeDots = () => {
    const opacities = []

    for (let i = 0; i < this.props.numberOfDots; i++) {
      const dot = new Animated.Value(this.props.minOpacity)
      opacities.push(dot)
    }

    return opacities
  }

  animationState = {
    dotOpacities: this.initializeDots(),
    targetOpacity: 1,
    shouldAnimate: true,
  }

  render() {
    return (
      <View style={styles.container}>
        {this.animationState.dotOpacities.map(this.renderAnimatedView)}
      </View>
    )
  }

  renderAnimatedView(opacity, index) {
    return <Animated.View key={index} style={[this.props.style, { opacity }]} />
  }

  animateDots = (whichDot) => {
    if (!this.animationState.shouldAnimate) return

    if (whichDot >= this.animationState.dotOpacities.length) {
      whichDot = 0
      const { minOpacity } = this.props
      this.animationState.targetOpacity = this.animationState.targetOpacity === minOpacity ? 1 : minOpacity
    }

    const nextDot = whichDot + 1

    Animated.timing(this.animationState.dotOpacities[whichDot], {
      toValue: this.animationState.targetOpacity,
      duration: this.props.animationDelay,
    }).start(this.animateDots.bind(this, nextDot))
  }


  componentDidMount() {
    this.animateDots(0)
  }

  componentWillUnmount() {
    this.animationState.shouldAnimate = false
  }

}

export default LoadingDots

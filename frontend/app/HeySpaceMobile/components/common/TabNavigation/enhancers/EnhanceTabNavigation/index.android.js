import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import BaseComponent from 'BaseComponent'
import { Animated, Dimensions } from 'react-native'
import { doNothing } from 'common/utils'

const { width: screenWidth } = Dimensions.get('window')

function enhance(ComposedComponent) {
  class EnhanceTabNavigation extends BaseComponent {

    static propTypes = {
      selectedTab: PropTypes.string.isRequired,
      tabItems: ImmutablePropTypes.list.isRequired,
      activeColor: PropTypes.string,
      additionalOffset: PropTypes.number,

      onChangeTab: PropTypes.func.isRequired,
    }

    static defaultProps = {
      additionalOffset: 0,
      onChangeTab: doNothing,
    }

    state = {
      left: new Animated.Value(0),
      tabWidth: (screenWidth / this.props.tabItems.size) - this.props.additionalOffset,
      isPopoverVisible: false,
    }

    render() {
      return (
        <ComposedComponent
          selectedTab={this.props.selectedTab}
          isPopoverVisible={this.state.isPopoverVisible}
          tabWidth={this.state.tabWidth}
          left={this.state.left}
          activeColor={this.props.activeColor}
          tabItems={this.props.tabItems}
          moreButtonRenderer={this.props.moreButtonRenderer}

          onChangeTab={this.onChangeTab}
        />
      )
    }

    onChangeTab(tabType) {
      this.props.onChangeTab(tabType)

      this.animateSelectedTabIndicator(tabType)
    }

    animateSelectedTabIndicator(selectedTabType) {
      const firstTab = this.props.tabItems.first()
      Animated.timing(this.state.left, {
        toValue: selectedTabType === firstTab.get('key') ? 0 : this.state.tabWidth,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.selectedTab !== this.props.selectedTab) {
        this.animateSelectedTabIndicator(this.props.selectedTab)
      }
    }

    componentDidMount() {
      this.animateSelectedTabIndicator(this.props.selectedTab)
    }

  }

  return EnhanceTabNavigation
}

export default enhance

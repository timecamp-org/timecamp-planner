import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import BaseComponent from 'BaseComponent'
import { doNothing } from 'common/utils'

function enhance(ComposedComponent) {
  class EnhanceTabNavigation extends BaseComponent {

    static propTypes = {
      selectedTab: PropTypes.string.isRequired,
      tabItems: ImmutablePropTypes.list.isRequired,
      onChangeTab: PropTypes.func,
    }

    static defaultProps = {
      additionalOffset: 0,
      onChangeTab: doNothing,
    }

    render() {
      const tabItems = this.getTabItems()
      return (
        <ComposedComponent
          selectedTabIndex={tabItems.indexOf(this.props.selectedTab)}
          tabItems={tabItems}
          wrapperBackgroundColorIOS={this.props.wrapperBackgroundColorIOS}
          onChangeTab={this.onChangeTab}
        />
      )
    }

    getTabItems() {
      return this.props.tabItems.map(item => item.get('key')).toJS()
    }

    onChangeTab(event) {
      const tabType = this.props.tabItems.getIn([event.nativeEvent.selectedSegmentIndex, 'key'])
      this.props.onChangeTab(tabType)
    }

  }

  return EnhanceTabNavigation
}

export default enhance

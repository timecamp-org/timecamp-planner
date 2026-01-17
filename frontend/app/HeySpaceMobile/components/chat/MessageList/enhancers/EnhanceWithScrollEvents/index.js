import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import { doNothing } from 'common/utils'

function Enhance(ComposedComponent) {
  class EnhanceWithScrollEvents extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onScrolledTop: PropTypes.func.isRequired,
      onScrolledBottom: PropTypes.func.isRequired,
      onScroll: PropTypes.func.isRequired,
      isScrolledToBottom: PropTypes.func.isRequired,
      isScrolledToTop: PropTypes.func.isRequired,
      onSetVirtualizedListRef: PropTypes.func,
      onListWrapperLayout: PropTypes.func,
      onResize: PropTypes.func,
    }

    static defaultProps = {
      onScrolledTop: doNothing,
      onScrolledBottom: doNothing,
      onScroll: doNothing,
      isScrolledToBottom: doNothing,
      isScrolledToTop: doNothing,
      onSetVirtualizedListRef: doNothing,
      onListWrapperLayout: doNothing,
      onResize: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onScroll={this.onScroll}
          onResize={this.onResize}
        />
      )
    }

    wasScrolledToTop = false
    wasScrolledToBottom = false

    onResize(contentWidth, contentHeight) {
      this.listContentHeight = contentHeight

      this.props.onResize(contentWidth, contentHeight)
    }

    onScroll(event) {
      const scrollPosition = event.nativeEvent.contentOffset.y
      const isScrolledToTop = this.props.isScrolledToTop(scrollPosition)
      const isScrolledToBottom = this.props.isScrolledToBottom(event)
      if (isScrolledToTop && !this.wasScrolledToTop) {
        this.props.onScrolledTop()
      } else if (isScrolledToBottom && !this.wasScrolledToBottom) {
        this.props.onScrolledBottom()
      }

      this.wasScrolledToTop = isScrolledToTop
      this.wasScrolledToBottom = isScrolledToBottom
      this.props.onScroll(event)
    }

  }

  return (EnhanceWithScrollEvents)
}

export default (Enhance)

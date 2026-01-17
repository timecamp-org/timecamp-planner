import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from '../../BaseComponent'
import { doNothing } from '../../../utils'

import { onSetObjectTopVisibleItem } from '../../../models/domain/MessagesModel/actions'

function Enhance(ComposedComponent) {
  class SaveScrollPosition extends BaseComponent {

    static propTypes = {
      objectId: PropTypes.string.isRequired,

      getTopVisibleItemIdAndOffset: PropTypes.func,
    }

    static defaultProps = {
      getTopVisibleItemIdAndOffset: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

    async onSaveScrollPosition() {
      const data = await this.props.getTopVisibleItemIdAndOffset(this.props.chatItems, this.props.objectId)
      if (!data) {
        return
      }
      const { objectId, idAndOffset } = data
      this.props.onSetObjectTopVisibleItem(idAndOffset, objectId)
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
      if (prevProps.objectId !== this.props.objectId) {
        return this.props.getTopVisibleItemIdAndOffset(prevProps.chatItems, prevProps.objectId)
      }

      return null
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
      if (snapshot !== null) {
        const result = await snapshot
        if (result) {
          const { objectId, idAndOffset } = result
          this.props.onSetObjectTopVisibleItem(idAndOffset, objectId)
        }
      }
    }

    componentWillUnmount() {
      this.onSaveScrollPosition()
    }

  }
  function mapDispatchToProps(dispatch, props) {
    return {
      onSetObjectTopVisibleItem: (topVisibleItemIdAndOffset, objectId) => dispatch(onSetObjectTopVisibleItem(topVisibleItemIdAndOffset, objectId)),
    }
  }

  return connect(null, mapDispatchToProps)(SaveScrollPosition)
}

export default (Enhance)

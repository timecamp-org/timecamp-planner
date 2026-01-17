import React from 'react'
import PropTypes from 'prop-types'
import { AppEventEmitter } from '../../services'
import { doNothing, extractParamsToInject } from '../../utils'
import { AppEventType } from 'common/types'
import { connect } from 'react-redux'
import { selectIsUserIdle, selectIsPageVisible } from 'models/domain/AppModel/selectors'

const EnhanceWithRefreshData = ({
  action,
  paramsToInject,
  isArgumentsValid = () => true,
}) => (ComposedComponent) => {
  class EnhanceWithRefreshData extends React.Component {
    static propTypes = {
      onFetchData: PropTypes.func.isRequired,
      isUserIdle: PropTypes.bool.isRequired,
      isPageVisible: PropTypes.bool.isRequired,
    }

    static defaultProps = {
      onFetchData: doNothing,
    }

    constructor(props) {
      super(props)
      this.onAppReconnected = this.onAppReconnected.bind(this)
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }

    onAppReconnected() {
      this.sheduledReconnect = true
      if (!this.props.isUserIdle && this.props.isPageVisible) {
        this.onFetchData()
      }
    }

    onFetchData() {
      this.sheduledReconnect = false
      if (isArgumentsValid(this.props)) {
        this.props.onFetchData()
      }
    }

    componentDidMount() {
      AppEventEmitter.on(AppEventType.APP_RECONNECTED, this.onAppReconnected)
    }

    componentWillUnmount() {
      AppEventEmitter.off(AppEventType.APP_RECONNECTED, this.onAppReconnected)
    }

    componentDidUpdate() {
      if (this.sheduledReconnect && !this.props.isUserIdle && this.props.isPageVisible) {
        this.onFetchData()
      }
    }
  }

  function mapStateToProps(state) {
    return ({
      isUserIdle: selectIsUserIdle(state),
      isPageVisible: selectIsPageVisible(state),
    })
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onFetchData: () => {
        const args = extractParamsToInject(paramsToInject, props)
        dispatch(action(...args))
      },
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWithRefreshData)
}

export default EnhanceWithRefreshData

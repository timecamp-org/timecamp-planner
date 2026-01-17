import React from 'react'
import { withRouter } from 'react-router-dom'


const Enhance = (params = [], shouldUpdateOnRouteChange = true) => (ComposedComponent) => {
  @withRouter
  class EnhanceWithRouter extends React.Component { // eslint-disable-line react/prefer-stateless-function

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

    shouldComponentUpdate(nextProps) {
      const { history, match, location, ...fields } = nextProps // eslint-disable-line

      const fieldsKeys = Object.keys(fields)
      for (let i = 0; i < fieldsKeys.length; i++) {
        const fieldKey = fieldsKeys[i]
        if (this.props[fieldKey] !== nextProps[fieldKey]) {
          return true
        }
      }

      if (!shouldUpdateOnRouteChange) {
        return false
      }

      if (params.length === 0) {
        if (this.props.location.pathname !== location.pathname) {
          return true
        }
      } else {
        for (let i = 0; i < params.length; i++) {
          const param = params[i]

          if (this.props.match.params[param] !== match.params[param]) {
            return true
          }
        }
      }

      return false
    }

  }

  return EnhanceWithRouter
}


export default Enhance

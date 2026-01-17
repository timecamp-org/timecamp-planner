import React from 'react'
import PropTypes from 'prop-types'
import EnhanceWithCurrentUserId from 'enhancers/users/EnhanceWithCurrentUserId'
import RedirectToDefaultPage from 'components/routing/RedirectTo/defaultPage'


function enhance(ComposedComponent) {
  @EnhanceWithCurrentUserId
  class RedirectToDefaultPageIfCurrentUserIsAuthenticated extends React.Component {

    static propTypes = {
      userId: PropTypes.string,
    }

    render() {
      if (this.props.userId) {
        return (
          <RedirectToDefaultPage />
        )
      } else {
        return (
          <ComposedComponent
            {...this.props}
          />
        )
      }
    }

  }

  return RedirectToDefaultPageIfCurrentUserIsAuthenticated
}

export default enhance

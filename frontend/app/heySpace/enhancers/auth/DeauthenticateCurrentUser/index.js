import React from 'react'

import { connect } from 'react-redux'

import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions'

function enhance(ComposedComponent) {
    class DeauthenticateCurrentUser extends React.Component {
        constructor(props) {
            super(props);
            this.props.onSignOut();
        }

        render() {
            return (
                <ComposedComponent {...this.props} />
            )
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            onSignOut: () => dispatch(CurrentUserModelActions.onSignOut())
        }
    }

    return connect(null, mapDispatchToProps)(DeauthenticateCurrentUser)
}

export default enhance

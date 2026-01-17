import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import * as OrganizationsModelActions from 'models/domain/OrganizationsModel/actions'
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors'
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes'

function enhance(ComposedComponent) {
  class EnhanceWithCreateWorkspace extends BaseComponent {

    static propTypes = {
      isSubmittingCreateWorkspace: PropTypes.bool.isRequired,
      onCreateWorkspace: PropTypes.func.isRequired,
    }

    state = {
      isWorkspaceNameValid: false,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isWorkspaceNameValid={this.state.isWorkspaceNameValid}
          isSubmittingCreateWorkspace={this.props.isSubmittingCreateWorkspace}
          validateWorkspaceName={this.validateWorkspaceName}
          
          setOuterWorkspaceNameInputRef={this.setOuterWorkspaceNameInputRef}
          onCreateWorkspace={this.onCreateWorkspace}
          onChangeText={this.onChangeText}
        />
      )
    }

    setOuterWorkspaceNameInputRef(ref) {
      this.outerWorkspaceNameInputRef = ref
    }

    validateWorkspaceName(workspaceName) {
      if (workspaceName && workspaceName.length > 0) {
        this.setState({
          isWorkspaceNameValid: true,
        })
        return {
          isValid: true,
          message: null,
        }
      } else {
        this.setState({
          isWorkspaceNameValid: false,
        })
        return {
          isValid: false,
          message: 'Specify workspace name',
        }
      }
    }

    onChangeText(value) {
      this.validateWorkspaceName(value)
    }

    onCreateWorkspace() {
      if (this.props.isSubmittingCreateWorkspace) {
        return
      }

      let workspaceName = ''
      if (this.outerWorkspaceNameInputRef) {
        workspaceName = this.outerWorkspaceNameInputRef.getValue()
      }

      if (workspaceName) {
        this.props.onCreateWorkspace(workspaceName)
      }
    }

  }

  function mapStateToProps(state, props) {
    return {
      isSubmittingCreateWorkspace: selectRequestIsLoading(state, { requestType: RequestTypes.createWorkspace }),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onCreateWorkspace: (workspaceName) => dispatch(OrganizationsModelActions.onRegisterOrganization(workspaceName, props.switchToNewOrganization)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWithCreateWorkspace)
}

export default enhance

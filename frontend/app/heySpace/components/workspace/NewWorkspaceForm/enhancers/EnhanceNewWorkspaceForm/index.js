import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import * as OrganizationsModelActions from 'models/domain/OrganizationsModel/actions';
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';

function enhance(Component) {
  class EnhanceNewWorkspaceForm extends BaseComponent {
    static propTypes = {
      title: PropTypes.string,
      switchToNewOrganization: PropTypes.bool,
      oncancel: PropTypes.func,
      onSuccess: PropTypes.func,
    };

    static defaultProps = {
      switchToNewOrganization: false,
      hideCancelButton: false,
      onSubmit: doNothing,
      onSuccess: doNothing,
    };

    state = {
      workspaceName: '',
      workspaceNameHumanMessageModel: null,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          submitButtonClassName={this.props.submitButtonClassName}
          submitButtonInnerClassName={this.props.submitButtonInnerClassName}
          workspaceName={this.state.workspaceName}
          title={this.props.title}
          isSubmitting={this.props.isSubmitting}
          hideCancelButton={this.props.hideCancelButton}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          workspaceNameHumanMessageModel={this.state.workspaceNameHumanMessageModel}
          onWorkspaceNameChange={this.onWorkspaceNameChange}
          onSubmit={this.onSubmit}
          onSetInnerRef={this.onSetInnerRef}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
          onCancel={this.props.onCancel}
        />
      );
    }

    onSubmit(event) {
      if (event) {
        event.preventDefault();
      }

      if (this.props.isSubmitting) {
        return;
      }

      this.setState({
        workspaceNameHumanMessageModel: null,
      });
      if (this.isWorkspaceNameValid()) {
        this.props.onRegisterOrganization(this.state.workspaceName, this.props.onSuccess);
      }
    }

    isWorkspaceNameValid() {
      const isValid = this.state.workspaceName && this.state.workspaceName.length > 0;
      if (isValid) {
        this.setState({ workspaceNameHumanMessageModel: null });
      } else {
        this.onWorkspaceNameInvalid('Enter workspace name');
      }
      return isValid;
    }

    onWorkspaceNameInvalid(text) {
      this.setState({
        workspaceNameHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onWorkspaceNameChange(event) {
      const text = event.target.value;

      if (!text) {
        this.setState({
          workspaceNameHumanMessageModel: null,
        });
      } else {
        // ok
      }
      this.setState({ workspaceName: text });
      if (!this.isEditing) {
        this.isEditing = true;
      }
    }

    onSetInnerRef(ref) {
      this.innerRef = ref;
    }

    onKeyDown(event) {
      if (event.key === 'Enter') {
        this.onSubmit(event);
      }
    }

    onBlur(event) {
      if (this.isEditing) {
        this.isWorkspaceNameValid();
      }
    }

    componentDidMount() {
      if (this.innerRef) {
        this.innerRef.focus();
      }
    }
  }

  function mapStateToProps(state) {
    return {
      isSubmitting: selectRequestIsLoading(state, {
        requestType: RequestTypes.createWorkspace,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onRegisterOrganization: (workspaceName, onSuccess) =>
        dispatch(
          OrganizationsModelActions.onRegisterOrganization(workspaceName, props.switchToNewOrganization, onSuccess),
        ),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNewWorkspaceForm);
}

export default enhance;

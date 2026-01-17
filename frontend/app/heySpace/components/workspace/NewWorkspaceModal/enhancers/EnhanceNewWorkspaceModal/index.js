import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { onSetIsWorkspaceModalOpen } from 'models/domain/AppModel/actions';
import { CreateWorkspaceStep } from 'models/domain/OrganizationsModel/types';
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';

function enhance(Component) {
  class EnhanceNewWorkspaceModal extends BaseComponent {

    static propTypes = {
      isWorkspaceModalOpen: PropTypes.bool,
      onSetIsWorkspaceModalOpen: PropTypes.func,
    };

    static defaultProps = {
      isWorkspaceModalOpen: false,
      onSubmit: doNothing,
      onSetIsWorkspaceModalOpen: doNothing,
    };

    state = {
      createWorkspaceStep: CreateWorkspaceStep.CREATE_WORKSPACE,
    };

    render() {
      return (
        <Component
          isWorkspaceModalOpen={this.props.isWorkspaceModalOpen}
          createWorkspaceStep={this.state.createWorkspaceStep}
          onSetIsWorkspaceModalOpen={this.onSetIsWorkspaceModalOpen}
          onCloseWorkspaceModal={this.onCloseWorkspaceModal}
          onOpenInviteModal={this.onOpenInviteModal}
        />
      );
    }

    onSetIsWorkspaceModalOpen(isWorkspaceModalOpen) {
      this.props.onSetIsWorkspaceModalOpen(isWorkspaceModalOpen);
    }

    onCloseWorkspaceModal() {
      this.props.onSetIsWorkspaceModalOpen(false);
      this.setState({
        createWorkspaceStep: CreateWorkspaceStep.CREATE_WORKSPACE,
      });
    }

    onOpenInviteModal() {
      this.setState({
        createWorkspaceStep: CreateWorkspaceStep.WORKSPACE_INVITATIONS,
      });
    }
  
}

  function mapStateToProps(state) {
    return {
      isWorkspaceCreated: selectRequestIsSuccess(state, {
        requestType: RequestTypes.createWorkspace,
      }),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetIsWorkspaceModalOpen: (isOpen) => dispatch(onSetIsWorkspaceModalOpen(isOpen)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNewWorkspaceModal);
}

export default enhance;

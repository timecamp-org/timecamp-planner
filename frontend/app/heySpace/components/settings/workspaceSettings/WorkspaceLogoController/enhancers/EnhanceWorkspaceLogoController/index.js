import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import handleError from 'common/utils/handleError';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as OrganizationsModelActions from 'models/domain/OrganizationsModel/actions';
import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';
import {
  selectCurrentOrganizationId,
  selectOrganizationInitials,
  selectOrganizationLogo,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

function WorkspaceLogoController(ComposedComponent) {
  class EnhanceWorkspaceLogoController extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      currentUserId: PropTypes.string.isRequired,
      className: PropTypes.string,

      onLogoUpload: PropTypes.func.isRequired,
      onSetOpenCallback: PropTypes.func.isRequired,
      onOpenFilePrompt: PropTypes.func.isRequired,
      organizationId: PropTypes.string,
    };

    state = {
      isHovering: false,
    };

    render() {
      return (
        <ComposedComponent
          organizationId={this.props.organizationId}
          workspaceThumbnail={this.props.workspaceThumbnail}
          workspaceInitials={this.props.workspaceInitials}
          className={this.props.className}
          isHovering={this.state.isHovering}
          isDisabled={!this.props.isCurrentUserWorkspaceAdmin}
          onOpenFilePrompt={this.props.onOpenFilePrompt}
          onSetOpenCallback={this.props.onSetOpenCallback}
          onChooseFile={this.onChooseFile}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    onChooseFile(files) {
      if (files && files.length > 0 && this.props.isCurrentUserWorkspaceAdmin) {
        this.props.onLogoUpload(files[0]);
      } else {
        handleError(new Error('Error selecting file'));
      }
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);

    return {
      currentUserId: selectCurrentUserId(state),
      isCurrentUserWorkspaceAdmin: selectIsCurrentUserOrganizationAdmin(state),
      workspaceThumbnail: selectOrganizationLogo(state, { organizationId }),
      workspaceInitials: selectOrganizationInitials(state, { organizationId }),
      organizationId,
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      onLogoUpload: (file) => dispatch(OrganizationsModelActions.onLogoUpload(file)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWorkspaceLogoController);
}

export default WorkspaceLogoController;

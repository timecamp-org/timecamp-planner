import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ObjectColors from 'common/commonStyles/projectColors';
import generateId from 'common/utils/generate-pushid';
import { ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { onProjectCreate } from 'models/domain/ProjectsModel/actions';

import { doNothing } from '../../../../../../common/utils';
function enhance(ComposedComponent) {
  class EnhanceAddSpaceController extends BaseComponent {
    static propTypes = {
      initialProjectName: PropTypes.string,

      onUpdateModalProjectName: PropTypes.func,
      onHideModal: PropTypes.func,

      // withRouter
      history: PropTypes.object,

      // from redux
      onCreateProject: PropTypes.func,
    };

    static defaultProps = {
      initialProjectName: '',
      onUpdateModalProjectName: doNothing,
    };

    state = {
      name: this.props.initialProjectName || '',
      purpose: '',
      color: ObjectColors.getRandomProjectColor(),
      isPrivate: false,
      isEmptyNameErrorVisible: false,
      isInviting: false,
      iconType: ProjectIconTypes.Trophy,
    };

    render() {
      return (
        <ComposedComponent
          projectName={this.state.name}
          color={this.state.color}
          iconType={this.state.iconType}
          isPrivate={this.state.isPrivate}
          isEmptyNameErrorVisible={this.state.isEmptyNameErrorVisible}
          onUpdateColor={this.onUpdateColor}
          onUpdateIcon={this.onUpdateIcon}
          onUpdateName={this.onUpdateName}
          onUpdateIsPrivate={this.onUpdateIsPrivate}
          onAddSpace={this.onAddSpace}
          onUpdatePurpose={this.onUpdatePurpose}
          onShowPurposeInput={doNothing}
          onHideModal={this.props.onHideModal}
          onSetInputRef={this.onSetInputRef}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    inputRef = null;

    onSetInputRef(ref) {
      this.inputRef = ref;
    }

    onKeyDown(event) {
      const enterCode = 13;
      if (event.keyCode === enterCode) {
        this.onAddSpace();
      }
    }

    onAddSpace() {
      if (this.state.name.length === 0) {
        return this.setState({
          isEmptyNameErrorVisible: true,
        });
      }

      const id = generateId();

      this.props.onCreateProject(
        {
          id,
          name: this.state.name,
          description: this.state.purpose,
          color: this.state.color,
          isPrivate: this.state.isPrivate,
          iconType: this.state.iconType,
        },
        () => this.props.history.push(`/projects/${id}/kanban`),
      );
      this.props?.onProjectCreate?.();
      this.props.onHideModal();
    }

    onUpdateIsPrivate(isPrivate) {
      this.setState({
        isPrivate,
      });
    }

    onUpdateIcon(iconType) {
      this.setState({
        iconType,
      });
    }

    onUpdateColor(color) {
      this.setState({
        color,
      });
    }

    onUpdateName(event) {
      const { value: name } = event.target;
      this.props.onUpdateModalProjectName(name);
      this.setState({
        name,
      });
    }

    onUpdatePurpose(event) {
      this.setState({
        purpose: event.target.value,
      });
    }

    componentDidMount() {
      if (this.inputRef) {
        this.inputRef.focus();
      }
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onCreateProject: (projectFields, callback) => dispatch(onProjectCreate(projectFields, undefined, false, callback)),
  });

  return connect(null, mapDispatchToProps)(EnhanceAddSpaceController);
}

export default enhance;

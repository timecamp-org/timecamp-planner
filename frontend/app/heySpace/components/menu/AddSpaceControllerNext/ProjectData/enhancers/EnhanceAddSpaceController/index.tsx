import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ObjectColors from 'common/commonStyles/projectColors';
import generateId from 'common/utils/generate-pushid';
import { ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';
import BaseComponent from 'commonEnhancers/BaseComponent';

import { doNothing } from '../../../../../../../common/utils';

function enhance(ComposedComponent) {
  class EnhanceAddSpaceController extends BaseComponent {
    static propTypes = {
      initialData: PropTypes.object,

      onUpdateModalProjectName: PropTypes.func,
      onCancel: PropTypes.func,

      // withRouter
      history: PropTypes.object,

      // from redux
      onCreateProject: PropTypes.func,
    };

    static defaultProps = {
      initialData: {},
      onUpdateModalProjectName: doNothing,
    };

    state = {
      name: '',
      description: '',
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
          description={this.state.description}
          color={this.state.color}
          iconType={this.state.iconType}
          isPrivate={this.state.isPrivate}
          isEmptyNameErrorVisible={this.state.isEmptyNameErrorVisible}
          onUpdateColor={this.onUpdateColor}
          onUpdateIcon={this.onUpdateIcon}
          onUpdateName={this.onUpdateName}
          onUpdateIsPrivate={this.onUpdateIsPrivate}
          onSubmit={this.onSubmit}
          onUpdateDescription={this.onUpdateDescription}
          onCancel={this.props.onCancel}
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
        this.onSubmit();
      }
    }

    // eslint-disable-next-line consistent-return
    onSubmit() {
      if (this.state.name.length === 0) {
        return this.setState({
          isEmptyNameErrorVisible: true,
        });
      }

      const id = generateId();

      this.props.onSubmit({
        id,
        name: this.state.name,
        description: this.state.description,
        color: this.state.color,
        isPrivate: this.state.isPrivate,
        iconType: this.state.iconType,
      });
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

    onUpdateDescription(event) {
      this.setState({
        description: event.target.value,
      });
    }

    componentDidMount() {
      if (this.props.initialData) {
        this.setState({
          ...this.state,
          ...this.props.initialData,
        });
      }

      if (this.inputRef) {
        this.inputRef.focus();
      }
    }
  }

  return connect()(EnhanceAddSpaceController);
}

export default enhance;

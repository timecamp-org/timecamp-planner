import { doNothing } from 'common/utils';
import { isValidFullName, prepareFullName } from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import * as UsersModelActions from 'models/domain/UsersModel/actions';
import { selectCurrentUserFullName, selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

export default function enhance(Component) {
  class EnhanceUserFullNameInput extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      humanMessageClassName: PropTypes.string,
      innerClassName: PropTypes.string,
      required: PropTypes.bool,
      label: PropTypes.string,
      autoFocus: PropTypes.bool,
      maxLength: PropTypes.number,

      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onKeyDown: PropTypes.func,
      onKeyUp: PropTypes.func,
    };

    static defaultProps = {
      onFocus: doNothing,
      onBlur: doNothing,
      onKeyDown: doNothing,
      onKeyUp: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        fullName: props.fullName,
        fullNameHumanMessageModel: null,
      };
    }

    render() {
      return (
        <Component
          className={this.props.className}
          humanMessageClassName={this.props.humanMessageClassName}
          innerClassName={this.props.innerClassName}
          fullName={this.state.fullName}
          required={this.props.required}
          label={this.props.label}
          maxLength={this.props.maxLength}
          autoFocus={this.props.autoFocus}
          fullNameHumanMessageModel={this.state.fullNameHumanMessageModel}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onUpdate={this.onFullNameUpdate}
        />
      );
    }

    onFullNameUpdate(event) {
      const fullName = event.target.value;

      if (!fullName) {
        this.setState({
          fullNameHumanMessageModel: null,
        });
      } else {
        // ok
      }

      this.setState({
        fullName,
      });
    }

    onFullNameInvalid(text) {
      this.setState({
        fullNameHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onFocus(event) {
      const text = event.target.value;
      this.setState({ fullName: text });
      this.props.onFocus();
    }

    onBlur(event) {
      const text = prepareFullName(event.target.value);
      this.setState({
        fullNameHumanMessageModel: null,
      });

      const validationFullNameResult = isValidFullName(text, true);
      if (validationFullNameResult.isValid) {
        const [firstName, lastName] = text.split(' ');
        this.props.onFirstNameUpdate(this.props.currentUserId, firstName);
        this.props.onLastNameUpdate(this.props.currentUserId, lastName);
        this.props.onUpdateUser();
        this.props.onBlur();
        this.setState({ fullName: null });
      } else {
        this.onFullNameInvalid(validationFullNameResult.message);
      }
    }
  }

  const mapStateToProps = (state) => ({
    fullName: selectCurrentUserFullName(state),
    currentUserId: selectCurrentUserId(state),
  });

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onFirstNameUpdate: (userId, firstName) => dispatch(UsersModelActions.onFirstNameUpdate(userId, firstName)),
      onLastNameUpdate: (userId, lastName) => dispatch(UsersModelActions.onLastNameUpdate(userId, lastName)),
      onUpdateUser: () => dispatch(UsersModelActions.onUpdateUser(null, true)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceUserFullNameInput);
}

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { debounce } from 'lodash';
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import * as SearchModelActions from 'models/component/SearchModel/actions';
import * as SearchModelSelectors from 'models/component/SearchModel/selectors/domain';
import { selectProjectIsGroupOrDirectChat } from 'models/domain/ProjectsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import PropTypes from 'prop-types';
import React from 'react';
import EnhanceWithClickOutside from 'react-click-outside';
import { connect } from 'react-redux';

const DEBOUNCE_TIMEOUT = 100;

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  @EnhanceWithClickOutside
  class EnhanceTaskSearch extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      filterId: PropTypes.string,
      innerClassName: PropTypes.string,
      projectId: PropTypes.string.isRequired,
      targetTaskId: PropTypes.string,
      isFocused: PropTypes.bool,
      onSearchTasks: PropTypes.func.isRequired,
      onSetIsFocused: PropTypes.func.isRequired,
      placeholder: PropTypes.string,
    };

    static defaultProps = {
      onSearchTasks: doNothing,
      onSetIsFocused: doNothing,
    };

    constructor() {
      super();
      this.state = { taskNameInputValue: '' };
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          taskNameInputClass={this.props.taskNameInputClass}
          isFocused={this.props.isFocused}
          taskNameInputValue={this.state.taskNameInputValue}
          inputRef={this.inputRef}
          onChangeTaskName={this.onChangeTaskName}
          onKeyDown={this.onKeyDown}
          onSetIsFocused={this.props.onSetIsFocused}
          onCancel={this.onCancel}
          placeholder={this.props.placeholder}
        />
      );
    }

    inputRef(ref) {
      this.input = ref;
    }

    onChangeTaskName({ target: { value } }) {
      this.setState({ ...this.state, taskNameInputValue: value });
      this.onSearchTasks(value, this.props.filterBy);
    }

    onKeyDown(event) {
      event.stopPropagation();
      if (event.key === 'Escape') {
        this.onCancel();
      }
    }

    onCancel() {
      this.clearTaskNameInputValue();
      this.props.onSetIsFocused(false);
      if (this.input) {
        this.input.blur();
      }
    }

    clearTaskNameInputValue() {
      this.setState({ ...this.state, taskNameInputValue: '' });
      this.props.onSearchTasks('', true, this.props.isConversation);
    }

    handleClickOutside() {
      if (this.props.taskNameInputValue.length > 0) {
        // leave focused
      } else {
        this.props.onSetIsFocused(false);
      }
    }

    onSearchTasks = debounce((text, filterBy) => {
      this.props.onSearchTasks(text, true, this.props.isConversation);
    }, DEBOUNCE_TIMEOUT);

    componentDidUpdate(prevProps) {
      if (this.props.filterBy && prevProps.filterBy && !this.props.filterBy.equals(prevProps.filterBy)) {
        this.onSearchTasks(this.props.taskNameInputValue, this.props.filterBy);
      }
    }

    componentDidMount() {
      this.onSearchTasks('', this.props.filterBy);
      setImmediate(() => {
        if (this.input) {
          this.input.focus();
        }
      });
    }
  }

  function mapStateToProps(state, ownProps) {
    const currentUserId = selectCurrentUserId(state);
    const filterId = ownProps.filterId || makeFilterId(currentUserId, TaskFiltersTargetType.KANBAN, ownProps.projectId);
    return {
      filterBy: FiltersModelSelectors.selectFilterBy(state, { filterId }),
      isConversation: selectProjectIsGroupOrDirectChat(state, {
        projectId: ownProps.projectId,
      }),
      taskNameInputValue: SearchModelSelectors.selectTaskSearchValue(state),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSearchTasks: (taskName, searchInCompletedTasks, searchInMyTasks) =>
        dispatch(
          SearchModelActions.searchTasks(taskName, props.projectId, true, searchInCompletedTasks, searchInMyTasks)
        ),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskSearch);
}

export default Enhance;

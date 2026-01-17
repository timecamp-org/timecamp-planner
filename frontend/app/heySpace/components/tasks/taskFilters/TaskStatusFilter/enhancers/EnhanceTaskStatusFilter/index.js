import React from 'react';

import PropTypes from 'prop-types';
import EnhaneWithClickOutside from 'react-click-outside';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import * as FiltersModelActions from 'models/component/FiltersModel/actions';
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { taskStatusOptions } from 'models/domain/TasksModel/constants/tasksFilters';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

function enhance(ComposedComponent) {
  @EnhaneWithClickOutside
  class EnhanceTaskStatusFilter extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      projectId: PropTypes.string.isRequired,
      filterId: PropTypes.string.isRequired,

      taskStatusFilter: PropTypes.string,
    };

    radioIconRefs = {};

    state = {
      isPopoverOpened: false,
    };

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}
          className={this.props.className}
          color={this.props.color}
          isPopoverOpened={this.state.isPopoverOpened}
          taskStatusOptions={taskStatusOptions}
          taskStatusFilter={
            this.props.taskStatusFilter || TaskStatusFilterType.ALL
          }
          onOpenPopover={this.onOpenPopover}
          onSelectStatusFilter={this.onSelectStatusFilter}
          onSetRadioIconRef={this.onSetRadioIconRef}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onFocus={this.onFocus}
        />
      );
    }

    onOpenPopover() {
      this.setState({
        isPopoverOpened: true,
      });
    }

    onClosePopover() {
      this.setState({
        isPopoverOpened: false,
      });
    }

    onMouseDown() {
      this.mouseDown = true;
    }

    onMouseUp() {
      this.mouseDown = false;
    }

    onFocus(event) {
      if (this.mouseDown) {
        event.target.blur();
      }
    }

    onSetRadioIconRef(ref, key) {
      if (ref) {
        this.radioIconRefs[key] = ref;
      }
    }

    onSelectStatusFilter(status) {
      this.props.onSetFilterBy(this.props.filterId, 'status', status);
    }

    onUpdateRadioColor() {
      const key = this.props.taskStatusFilter || TaskStatusFilterType.ALL;

      if (this.radioIconRefs[key]) {
        const ellipses =
          this.radioIconRefs[key].getElementsByTagName('ellipse');

        if (ellipses && ellipses.length === 2) {
          ellipses[0].setAttribute('stroke', this.props.color);
          ellipses[1].setAttribute('fill', this.props.color);
        }
      }
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onClosePopover();
      }
    }

    componentDidMount() {
      this.props.onInitFilters(this.props.filterId);
      this.onUpdateRadioColor();
      this.popperRootNode = document.getElementById('popper-root');
    }

    componentDidUpdate() {
      this.onUpdateRadioColor();
    }
  }

  const mapStateToProps = (state, props) => {
    const currentUserId = selectCurrentUserId(state);
    const filterId = makeFilterId(
      currentUserId,
      TaskFiltersTargetType.KANBAN_VERTICAL,
      props.projectId
    );

    return {
      taskStatusFilter: FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'status',
      }),
      filterId,
      color: selectProjectColor(state, { projectId: props.projectId }),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onSetFilterBy: (filterId, filterKey, filterValue) =>
      dispatch(
        FiltersModelActions.onSetFilterBy(filterId, filterKey, filterValue)
      ),
    onInitFilters: (filterId) => dispatch(FiltersModelActions.onInit(filterId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskStatusFilter);
}

export default enhance;

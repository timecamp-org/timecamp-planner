import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { TaskFiltersTargetType, TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectIsExtensionEnabled } from 'models/domain/ExtensionsModel/selectors/domain';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { selectFilteredTaskIdsByListId, selectProjectIdByListId } from 'models/domain/ListsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import { selectCurrentPathname } from 'models/domain/RouterModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

function Enhance(ComposedComponent) {
  class EnhanceDraggableSectionListItem extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      sectionId: PropTypes.string.isRequired,
      organizationId: PropTypes.string.isRequired,
    };

    state = {
      scrollContainer: null,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          wrapperClassName={this.props.wrapperClassName}
          children={this.props.children}
          sectionId={this.props.sectionId}
          kanbanTaskIds={this.props.kanbanTaskIds}
          index={this.props.index}
          userId={this.props.userId}
          sectionOptions={this.props.sectionOptions}
          isKanban={this.props.isKanban}
          isVirtual={this.props.isVirtual}
          isDraggable={this.props.isDraggable}
          shouldRenderProjectIcon={this.props.shouldRenderProjectIcon}
          scrollContainer={this.state.scrollContainer}
          renderFooter={this.props.renderFooter}
          isSelected={this.props.isSelected}
          isCardsLimitEnabled={this.props.isKanbanLimitsExtensionEnabled}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onMouseUp={this.props.onMouseUp}
          onSelectTask={this.props.onSelectTask}
          onAddCard={this.props.onAddCard}
          scrollListToBottom={this.scrollListToBottom}
          onSetRef={this.onSetRef}
        />
      );
    }

    scrollListToBottom() {
      if (this.listWrapperRef) {
        this.listWrapperRef.scrollTop = this.listWrapperRef.scrollHeight;
      }
    }

    onSetRef(div) {
      if (div) {
        this.listRef = div;
        this.setState({ scrollContainer: div });
        this.props.onSetRef(div);
      }
    }

    // TODO: make it work with virtualization
    // componentDidMount() {
    //   const { sectionScrollTop } = this.props
    //   if (this.listRef && sectionScrollTop !== null && typeof sectionScrollTop !== 'undefined' && sectionScrollTop !== this.listRef.scrollTop) {
    //     this.listRef.scrollTop = sectionScrollTop
    //   }
    // }

    // TODO: make it work with virtualization
    // componentWillUnmount() {
    // const { sectionScrollTop } = this.props
    // if (this.listRef && this.listRef.scrollTop !== null && typeof this.listRef.scrollTop !== 'undefined' && sectionScrollTop !== this.listRef.scrollTop) {
    //   this.props.onSetSectionScrollTop(this.listRef.scrollTop)
    // }
    // }
  }

  function mapStateToProps(state, props) {
    const projectId = selectProjectIdByListId(state, {
      listId: props.sectionId,
    });
    const currentPathname = selectCurrentPathname(state);
    const currentUserId = selectCurrentUserId(state);
    const currentOrganizationId = selectCurrentOrganizationId(state);

    const filterTargetType = currentPathname.includes('/overwatch')
      ? TaskFiltersContainerType.OVERWATCH_SPACE_TILE
      : TaskFiltersTargetType.KANBAN;

    const filterId = makeFilterId(currentUserId, filterTargetType, projectId);

    return {
      // sectionScrollTop: selectSectionScrollTop(state, { sectionId: props.sectionId }),
      kanbanTaskIds: selectFilteredTaskIdsByListId(state, {
        listId: props.sectionId,
        projectId,
        filterId,
      }),
      organizationId: selectCurrentOrganizationId(state),
      isKanbanLimitsExtensionEnabled: selectIsExtensionEnabled(state, {
        organizationId: currentOrganizationId,
        projectId,
        extensionNamespace: ExtensionNamespace.KANBAN_LIMITS,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSetSectionScrollTop: (scrollTop) =>
        dispatch(ProjectsModelActions.onSetSectionScrollTop(props.sectionId, scrollTop)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceDraggableSectionListItem);
}

export default Enhance;

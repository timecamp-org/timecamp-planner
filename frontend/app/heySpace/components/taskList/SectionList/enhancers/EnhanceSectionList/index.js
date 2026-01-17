import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import * as SearchModelSelectors from 'models/component/SearchModel/selectors/domain';
import { selectIsExtensionEnabled } from 'models/domain/ExtensionsModel/selectors/domain';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { selectFilteredListIdsInOrder } from 'models/domain/ListsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectProjectBackground, selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { selectProjectViewRequestIsLoadingInitially } from 'models/domain/RequestModel/selectors/projectViewRequest';
import { selectCurrentPathname } from 'models/domain/RouterModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import commonStyles from 'styles/common.css';

const columnWidth = 270;
const tooltipHeight = 119;
const tooltipWidth = 275;
const tooltipPadding = 4 * parseInt(commonStyles.gridCellSize, 10);

const emptyList = new List();

export default function Enhance(Component) {
  class EnhanceSectionList extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      organizationId: PropTypes.string,
      innerRef: PropTypes.func,

      isKanban: PropTypes.bool,
      isVirtual: PropTypes.bool,

      listIds: ImmutablePropTypes.list.isRequired,
    };

    static defaultProps = {
      isKanban: false,
      isVirtual: false,
      innerRef: doNothing,
      listIds: emptyList,
      onScrollTaskListToBottom: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        tooltip: {},
        isSectionInputFocused: false,
      };
    }

    render() {
      return (
        <Component
          onMouseDown={this.props.onMouseDown}
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          sectionClassName={this.props.sectionClassName}
          listIds={this.props.listIds}
          projectId={this.props.projectId}
          isLoading={this.props.isLoading}
          color={this.props.color}
          tooltip={this.state.tooltip}
          isKanban={this.props.isKanban}
          isVirtual={this.props.isVirtual}
          sectionOptions={this.getSectionOptions()}
          shouldRenderAddSectionButton={this.props.shouldRenderAddSectionButton}
          onSetInnerRef={this.onSetInnerRef}
          onWorkspaceDoubleClick={this.onWorkspaceDoubleClick}
          onAddSectionDispatched={this.onAddSectionDispatched}
          onAddSectionCancelled={this.onAddSectionCancelled}
          isSectionInputFocused={this.state.isSectionInputFocused}
          isSearchingTasks={this.props.isSearchingTasks}
          onSetIsSectionInputFocused={this.onSetIsSectionInputFocused}
          shouldRenderFirstSectionInput={this.props.shouldRenderFirstSectionInput}
          onSetShouldRenderFirstSectionInput={this.props.onSetShouldRenderFirstSectionInput}
          projectBackground={this.props.projectBackground}
        />
      );
    }

    getSectionOptions() {
      const { isKanbanLimitsExtensionEnabled } = this.props;

      let options = new List(['AddCard', 'MoveList', 'CopyList', 'MoveAllCards', 'ArchiveList', 'FollowList']);

      if (isKanbanLimitsExtensionEnabled) {
        options = options.push('CardLimit');
      }

      return options;
    }

    onSetInnerRef(ref) {
      this.taskListRef = ref;

      if (!this.taskListBottom && !this.taskListRight) {
        this.updateTaskListClientPositionValues();
      }

      this.props.innerRef(ref);
    }

    updateTaskListClientPositionValues() {
      if (this.taskListRef) {
        const { bottom, right, left, top } = this.taskListRef.getBoundingClientRect();
        this.taskListTop = top;
        this.taskListLeft = left;
        this.taskListBottom = bottom;
        this.taskListRight = right;
        this.taskListWidth = right - left;
      }
    }

    onWorkspaceDoubleClick(event, sectionId, nextSectionId) {
      if (this.taskListRef) {
        let finalSectionId;
        const width = event.target.offsetWidth;
        const x = event.pageX - this.taskListRef.offsetLeft - event.target.offsetLeft + this.taskListRef.scrollLeft;
        if (width / 2 > x) {
          finalSectionId = sectionId;
        } else {
          finalSectionId = nextSectionId;
        }

        this.updateTaskListClientPositionValues();

        const { scrollLeft } = this.taskListRef;

        const tooltip = {
          x: event.pageX + (scrollLeft - this.taskListLeft),
          y: event.pageY - this.taskListTop,
          id: finalSectionId,
          width: tooltipWidth,
          height: tooltipHeight,
        };

        if (tooltip.y + tooltipHeight >= this.taskListBottom - this.taskListTop - tooltipPadding) {
          tooltip.y -= tooltipHeight;
        }
        if (tooltip.x + tooltipWidth >= this.taskListRight + (scrollLeft - this.taskListLeft - tooltipPadding)) {
          tooltip.x -= tooltipWidth;
        }

        this.setState({ tooltip });
      }
    }

    onAddSectionDispatched() {
      this.addSectionDispatched = true;
      this.setState({
        tooltip: {},
      });
    }

    onAddSectionCancelled() {
      this.setState({
        tooltip: {},
      });
    }

    onSetIsSectionInputFocused(isSectionInputFocused) {
      this.setState({ isSectionInputFocused });
      if (isSectionInputFocused) {
        this.props.onScrollTaskListToBottom();
      }
    }

    scrollToSection(index) {
      const left = index * columnWidth;

      if (this.taskListRef.scrollLeft > left || left > this.taskListWidth) {
        this.taskListRef.scrollTo(left, 0);
      }
    }

    onFocusInput() {
      this.onSetIsSectionInputFocused(true);
    }

    componentDidMount() {
      if (this.props.taskListRef) {
        this.props.taskListRef(this);
      }
      document.addEventListener('TaskList_FocusSectionInput', this.onFocusInput);
    }

    componentWillUnmount() {
      document.removeEventListener('TaskList_FocusSectionInput', this.onFocusInput);
    }
  }

  function mapStateToProps(state, ownProps) {
    const currentUserId = selectCurrentUserId(state);
    const currentPathname = selectCurrentPathname(state);
    const filterTargetType = currentPathname.includes('/overwatch')
      ? TaskFiltersContainerType.OVERWATCH_SPACE_TILE
      : ownProps.isKanban
      ? TaskFiltersTargetType.KANBAN
      : TaskFiltersTargetType.KANBAN_VERTICAL;
    const filterId = makeFilterId(currentUserId, filterTargetType, ownProps.projectId);
    const organizationId = selectCurrentOrganizationId(state);
    const projectBackground = selectProjectBackground(state, { projectId: ownProps.projectId });

    return {
      filterId,
      listIds: selectFilteredListIdsInOrder(state, {
        projectId: ownProps.projectId,
        filterId,
      }),
      isSearchingTasks: SearchModelSelectors.selectIsSearchingTasks(state),
      color: selectProjectColor(state, { projectId: ownProps.projectId }),
      isLoading: selectProjectViewRequestIsLoadingInitially(state, {
        projectId: ownProps.projectId,
        taskFiltersTargetType: filterTargetType,
      }),
      isKanbanLimitsExtensionEnabled: selectIsExtensionEnabled(state, {
        organizationId,
        projectId: ownProps.projectId,
        extensionNamespace: ExtensionNamespace.KANBAN_LIMITS,
      }),
      projectBackground,
    };
  }

  return connect(mapStateToProps)(EnhanceSectionList);
}

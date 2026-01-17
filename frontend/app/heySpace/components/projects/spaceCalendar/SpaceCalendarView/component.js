import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';

import colorStyles from 'styles/colors.css';

import { makeProjectChatLink } from 'common/utils/routerHelpers';
import FullCalendar from 'commonComponents/FullCalendar';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import { useTranslation } from 'i18n';
import { DEFAULT_OFFSET } from 'models/component/FullCalendarModel/constants';
import { Views } from 'react-big-calendar';
import CardEventAgenda from '../CardEventAgenda';
import CardEventMonth from '../CardEventMonth';
import CardEventTimeGrid from '../CardEventTimeGrid';
import DateCellWrapper from '../DateCellWrapper';
import EmptyEventListPlaceholder from '../EmptyEventListPlaceholder';
import ToolbarWrapper from '../ToolbarWrapper';

import styles from './styles.css';

SpaceCalendarView.propTypes = {
  className: PropTypes.string,
  projectId: PropTypes.string.isRequired,
  cardEvents: PropTypes.array,
  color: PropTypes.string,
  currentView: PropTypes.string,
  currentDate: PropTypes.object,
  shouldRenderEmptyPage: PropTypes.bool,
  isInternalCalendarEnabled: PropTypes.bool,
  offset: PropTypes.number,

  onEventClick: PropTypes.func,
  onEventDrop: PropTypes.func,
  onEventResize: PropTypes.func,
  onSetDateRange: PropTypes.func,
  onSetCurrentView: PropTypes.func,
  onSetCurrentDate: PropTypes.func,
};

SpaceCalendarView.defaultProps = {
  className: '',
  cardEvents: [],
  color: colorStyles.wisteriaColor,
  currentView: Views.MONTH,
  shouldRenderEmptyPage: false,
  isInternalCalendarEnabled: false,
  offset: DEFAULT_OFFSET,

  onEventClick: doNothing,
  onEventDrop: doNothing,
  onEventResize: doNothing,
  onSetDateRange: doNothing,
  onSetCurrentView: doNothing,
  onSetCurrentDate: doNothing,
};

const components = {
  agenda: {
    event: CardEventAgenda,
  },
  month: {
    event: CardEventMonth,
  },
  day: {
    event: CardEventTimeGrid,
  },
  week: {
    event: CardEventTimeGrid,
  },
  dateCellWrapper: DateCellWrapper,
  timeSlotWrapper: DateCellWrapper,
  toolbar: ToolbarWrapper,
};

function SpaceCalendarView(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      <FullCalendar
        className={props.shouldRenderEmptyPage ? styles.emptyCalendar : props.innerClassName}
        length={props.currentOffset}
        events={props.cardEvents}
        components={components}
        color={props.color}
        view={props.currentView}
        date={props.currentDate}
        dateRange={props.dateRange}
        onEventClick={props.onEventClick}
        onDateClick={props.onSetDateRange}
        onEventDrop={props.onEventDrop}
        onEventResize={props.onEventResize}
        onChangeView={props.onSetCurrentView}
        eventPropGetter={getEventProps}
      />
      {props.shouldRenderEmptyPage && renderCaseEmptyEvents()}
      {props.isInternalCalendarEnabled || (
        <NoAccessToFeatureModal
          fallbackUrl={makeProjectChatLink({ projectId: props.projectId })}
          title={t('Calendar is not available in your current plan.')}
          featureName={t('Calendar')}
        />
      )}
    </div>
  );

  function getEventProps(event) {
    const taskId = event.id;
    const taskColor = props.tasksColors.get(taskId) || props.color;

    switch (props.currentView) {
      case Views.AGENDA: {
        return {
          style: {
            color: colorStyles.darkGreyBlueColor,
          },
        };
      }
      default: {
        return {
          className: styles.weekEvent,
        };
      }
    }
  }

  function renderCaseEmptyEvents() {
    return <EmptyEventListPlaceholder />;
  }
}

export default SpaceCalendarView;

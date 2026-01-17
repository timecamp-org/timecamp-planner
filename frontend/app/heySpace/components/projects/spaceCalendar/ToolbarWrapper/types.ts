import { Id } from 'common/utils/identifier';
import { Moment } from 'moment';
import { Views } from 'react-big-calendar';
export interface ToolbarWrapperInterface {
  date: Moment;
  label: string;
  currentView: Views;
  onSetView: () => void;
  onSetDate: () => void;
  projectId: Id;
  onSetCurrentDate: (projectId: Id, date: Date) => void;

  onClickPrevious: () => void;
  onClickNext: () => void;

  onSetCurrentView: (currentView: Views) => void;
}

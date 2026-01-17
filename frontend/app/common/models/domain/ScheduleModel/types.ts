import { Id } from 'common/utils/identifier';
import { SumPeriod } from '../TaskTimeEstimateModel/types';
import { TaskStatus, TaskTimelineItem } from '../TasksModel/types';

export interface TaskScheduleInterface {
  id: Id;
  name: string;
  startDate: number;
  dueDate: number;
  projectId: Id;
  userId: Id;
  minutes: number | null;
  skipWeekends: boolean | null;
  sumPeriod: SumPeriod | null;
  progress: number;
  color: string;
  hasAccess: boolean;
  totalWorkingDays?: number;
  minutesPerDay?: number;
  status: TaskStatus;
  canChangeGroup?: boolean;
}

export interface ScheduleState {
  scheduleData: TaskScheduleInterface[];
}

export type ScheduleItem = {
  start_time: number;
  end_time: number;
  isEditable: boolean;
  totalWorkingDays?: number;
} & TaskTimelineItem &
  TaskScheduleInterface;

export interface GroupItemInterface {
  id: Id;
  title: string;
}

export interface ScheduleTimelineDataInterface {
  items: ScheduleItem[];
  groups: GroupItemInterface[];
}

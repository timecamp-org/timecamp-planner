import axios from 'axios';
import { injectable } from 'inversify';
import {
  CreateEntryOptions,
  CreateTimeEntryRequestResult,
  GetEntryOptions,
  TimeCampApiInterface,
  TimeCampTaskInfoResponse,
  TimeCampTimeEntriesRequestData,
  TimeCampTimeEntryRequestData,
  TimeCampTimerRequestData,
  TimerOptions,
} from './interfaces/TimeCampApiInterface';
import { TimeEntry, TimerStatus } from './types';
import queryString = require('query-string');
const TIMECAMP_API_URL = 'https://app.timecamp.com';

interface TimeCampRequestOptions<T> {
  data?: T;
  token: string;
  url: string;
  method: string;
}

const timeCampRequest = async <T>({ token, ...specs }: TimeCampRequestOptions<T>): Promise<any> => {
  try {
    const response = await axios({
      ...specs,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.data;
  } catch (error) {
    throw new Error(error);
  }
};

@injectable()
export class TimeCampApi implements TimeCampApiInterface {
  constructor() {}

  async getTaskIdFromExternalTaskId({ token, taskId }): Promise<TimeCampTaskInfoResponse> {
    const url = `${TIMECAMP_API_URL}/third_party/api/tasks?${queryString.stringify({
      external_task_id: taskId,
    })}`;

    const timeCampTaskInfoResponse = await timeCampRequest({
      method: 'GET',
      url,
      token,
    });

    return timeCampTaskInfoResponse;
  }

  async startTimer({ token, ...data }: TimerOptions): Promise<void> {
    const url = `${TIMECAMP_API_URL}/third_party/api/timer`;
    return await timeCampRequest<TimeCampTimerRequestData>({
      method: 'POST',
      token,
      url,
      data: { ...data, action: 'start' },
    });
  }

  async stopTimer({ token, ...data }: TimerOptions): Promise<void> {
    const url = `${TIMECAMP_API_URL}/third_party/api/timer`;
    return await timeCampRequest<TimeCampTimerRequestData>({
      method: 'POST',
      token,
      url,
      data: { ...data, action: 'stop' },
    });
  }

  async getTimerStatus({ token, ...data }: TimerOptions): Promise<TimerStatus> {
    const url = `${TIMECAMP_API_URL}/third_party/api/timer`;
    return await timeCampRequest<TimeCampTimerRequestData>({
      method: 'POST',
      token,
      url,
      data: { ...data, action: 'status' },
    });
  }

  async createTimeEntry({ token, ...data }: CreateEntryOptions): Promise<CreateTimeEntryRequestResult> {
    const url = `${TIMECAMP_API_URL}/third_party/api/entries`;

    return await timeCampRequest<TimeCampTimeEntryRequestData>({
      method: 'POST',
      token,
      url,
      data,
    });
  }

  async getTimeEntries({ token, taskId, ...data }: GetEntryOptions): Promise<TimeEntry[]> {
    const url = `${TIMECAMP_API_URL}/internal/api/v3/time-entries`;

    return await timeCampRequest<TimeCampTimeEntriesRequestData>({
      method: 'POST',
      token,
      url,
      data: {
        taskIds: [taskId],
        startDate: '1999-01-01',
        endDate: '2099-01-01',
      },
    });
  }
}

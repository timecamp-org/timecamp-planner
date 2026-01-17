import axios from 'axios';
import * as crypto from 'crypto';
import { EntityType } from '../common/enum';
import { NotificationAction } from '../db/types';
import { Id } from '../common/identifier';

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export const getRedisMessageId = (
  webhookId: Id,
  entityType: EntityType,
  operation: NotificationAction,
  payloadId: Id
) => {
  const redisMessageId = `${webhookId}/${entityType}/${operation}/${payloadId}`;

  return redisMessageId;
};

export function getHeaders(salt: string, data: any) {
  const hash = crypto.createHmac('sha256', salt).update(JSON.stringify(data)).digest('base64');
  return {
    'X-PLANNER-SIGNATURE': hash,
  };
}

export function getPayload(timestamp: number, data: any) {
  return {
    timestamp,
    ...data,
  };
}

export function convertFailedResponse(failedResponse: any) {
  const { status, statusText, data } = failedResponse;
  return {
    status,
    statusText,
    data,
  };
}

export const webhookRequest = async ({ data, headers, callbackUrl: url }) => {
  try {
    const response = await axios({
      headers,
      method: 'POST',
      url,
      data,
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      return { status: 400, request: error };
    }
  }
};

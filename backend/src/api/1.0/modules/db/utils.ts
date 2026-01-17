/**
 * Notifications from postgres contain id either as string or tuple:
 * 123123123
 * OR
 * (123123, 123123)
 * 
 * This method converts both formats to array of ids:
 * 123 -> [123]
 * (123, 123) -> [123, 123]
 * @param ids
 * @return {string[]}
 */
import { Id } from '../common/identifier'

export function parseNotificationIds(ids: string) : Id [] {
  return ids.replace(/([()])/g, '').split(',')
}

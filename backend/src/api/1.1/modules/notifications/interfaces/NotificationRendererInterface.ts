import { NotificationDbRow } from "../../db/schema";
import { NotificationContent } from "../types";
import { ChainableRendererInterface } from "./ChainableRendererInterface";

/**
 * There will be at least 2 renderers:
 * - plain text (for push)
 * - html (for emails)
 */
export interface NotificationRendererInterface<T extends NotificationContent> {
  renderNotification(notification: NotificationDbRow): Promise<T>
  addRenderer(renderer: ChainableRendererInterface<T>): this
  add(renderer: ChainableRendererInterface<T>): this
}

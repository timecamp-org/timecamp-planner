import { ChainableContextInterface } from "./ChainableContextInterface";
import { NotificationContent } from "../types";

/**
 * One link in renderer chain. RendererChain queries all links to return notification content.
 * First notification received is returned.
 */
export interface ChainableRendererInterface<T extends NotificationContent> {
  render(context: ChainableContextInterface): Promise<T>;
}

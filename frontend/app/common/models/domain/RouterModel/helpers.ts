import { NavigationStackItemInterface } from "./types";
import { Maybe } from "common/types";

export function createUrlFromRoute(route: NavigationStackItemInterface): Maybe<string> {
  if (!route) {
    return null
  }

  let url = `/${route.objectType}/${route.projectId}`

  if (route.projectPanelType) {
    url = `${url}/${route.projectPanelType}`
  }

  if (route.rightPanelType) {
    url = `${url}/${route.rightPanelType}`
  }

  if (route.taskId) {
    url = `${url}?taskId=${route.taskId}`
  }

  return url
}

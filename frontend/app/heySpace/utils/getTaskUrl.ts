import { Id } from "../../common/utils/identifier";
import getSpaceUrl from "./getSpaceUrl";
import { ProjectPanelType } from "../../common/models/domain/ProjectsSettingsModel/types";

const getTaskUrl = (taskId: Id, spaceId: Id, projectPanelType?: ProjectPanelType): string =>
  `${getSpaceUrl(spaceId, projectPanelType)}?taskId=${taskId}`

export default getTaskUrl
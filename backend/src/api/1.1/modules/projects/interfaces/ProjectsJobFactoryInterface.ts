import { Id } from "../../common/identifier";
import { DetermineOrderForUnarchivedSpaceJobInterface } from "../../projectPersonalStructure/types";

export interface ProjectsJobFactoryInterface {
  createDetermineOrderForUnarchivedSpaceJob(
    projectId: Id,
    organizationId: Id,
    lastUserId?: Id,
  ): DetermineOrderForUnarchivedSpaceJobInterface
}
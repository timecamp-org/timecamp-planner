import { ProjectsJobInterface } from "../types";

export interface ProjectsSubWorkerInterface {

  supports(job: ProjectsJobInterface): PromiseLike<boolean>

  handle(job: ProjectsJobInterface): PromiseLike<void>

}
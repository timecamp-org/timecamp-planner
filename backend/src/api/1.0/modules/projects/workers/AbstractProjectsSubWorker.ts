import { unmanaged, injectable } from "inversify";
import { ProjectsSubWorkerInterface } from "../interfaces/ProjectsSubWorkerInterface";
import { ProjectsJobInterface, ProjectsJobType } from "../types";

@injectable()
export abstract class AbstractProjectsSubWorker
  implements ProjectsSubWorkerInterface {

  protected constructor(
    @unmanaged() protected jobType: ProjectsJobType,
  ) { }

  public abstract handle(job: ProjectsJobInterface): Promise<void>

  public async supports(job: ProjectsJobInterface): Promise<boolean> {
    return job.type === this.jobType
  }

}
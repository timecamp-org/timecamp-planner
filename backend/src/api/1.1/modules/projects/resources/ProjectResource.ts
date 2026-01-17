import { AbstractResource } from '../../../../../infrastructure/resources/AbstractResource';
import {
  ProjectResourceData, ProjectQueryParams
} from '../types';
import { injectable, inject } from 'inversify';
import { AnyDict } from '../../common/types';
import { ProjectResourceContext, ProjectMetadataType } from '../types'
import { PaginationModule } from '../../pagination/PaginationModule';
import { QueryModifier } from '../../../../../services/types';
import { PaginationServiceFactoryInterface } from '../../pagination/interfaces/PaginationServiceFactoryInterface';
import { TimeRangePaginatorOptions } from '../../pagination/types';
import { ProjectsModule } from '../ProjectsModule';
import { ProjectProviderInterface } from '../interfaces/ProjectProviderInterface';
import { ProjectPeopleServiceInterface } from '../interfaces/ProjectPeopleServiceInterface';
import { ProjectFollowersServiceInterface } from '../interfaces/ProjectFollowersServiceInterface';
import { ExtensionsModule } from '../../extensions/ExtensionsModule';
import { CustomFieldServiceInterface } from '../../extensions/interfaces/CustomFieldServiceInterface';
import { CustomFieldTargetType } from '../../db/schema';

@injectable()
export class ProjectResource
  extends AbstractResource<ProjectQueryParams, ProjectResourceContext, ProjectResourceData> {

  constructor(
    @inject(PaginationModule.PaginationServiceFactoryInterface)
    paginationServiceFactory: PaginationServiceFactoryInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectsProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ProjectFollowersServiceInterface)
    private projectFollowersService: ProjectFollowersServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    private customFieldService: CustomFieldServiceInterface,
  ) {
    super(paginationServiceFactory)
  }

  async getData(queryParams: ProjectQueryParams, context: ProjectResourceContext): Promise<ProjectResourceData> {
    const { projectId } = context

    let columnNames = this.getColumnNames(queryParams)

    const project = await this.projectsProvider.getProject(projectId, null, columnNames)
    const metadata = await this.getMetadata(queryParams, { ...context })

    return {
      project,
      ...metadata
    }
  }

  public getQueryDecorators(queryParams: ProjectQueryParams): QueryModifier[] {
    return null
  }

  public getPaginatorOptions(queryParams: ProjectQueryParams): TimeRangePaginatorOptions {
    return null
  }

  protected async getMetadataPromiseForField(field: string, context: ProjectResourceContext): Promise<AnyDict> {
    const { projectId } = context

    switch (field) {
      case ProjectMetadataType.PEOPLE: {
        return this.projectPeopleService.getProjectPeople(projectId)
      }
      case ProjectMetadataType.FOLLOWERS: {
        return this.projectFollowersService.getProjectFollowerIds(projectId)
      }
      case ProjectMetadataType.CUSTOM_FIELDS: {
        const { values } = await this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.PROJECT, [projectId])
        return values
      }
    }
  }

}
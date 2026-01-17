import { inject, injectable } from 'inversify'
import { AbstractDataExporter } from '../AbstractDataExporter'
import { ExportDataProviderInterface } from '../interfaces/ExportDataProviderInterface'
import { Response } from 'express'
import {
  BoardCardsContext,
  BoardCardsExportResult,
  BoardCardsParams,
  BoardTaskAssigneeEmailsMap,
  ExportDataType,
  ExporterType,
  ExportOutputFormat,
  GetContextResult,
  GetContextStatus, ListNamesByListIds, TaskEstimatesMap,
} from '../types'
import { ListProviderInterface } from '../../lists/interfaces/ListProviderInterface'
import { ProjectProviderInterface } from '../../projects/interfaces/ProjectProviderInterface'
import { UserInProjectProviderInterface } from '../../projects/interfaces/UserInProjectProviderInterface'
import { LoggerInterface } from '../../../../../infrastructure/logger'
import { UserInOrganizationProviderInterface } from '../../organizations/interfaces/UserInOrganizationProviderInterface'
import { isNil } from 'lodash'
import { TaskServiceInterface } from '../../tasks/interfaces/TaskServiceInterface'
import { TagServiceInterface } from '../../tags/TagServiceInterface'
import { TagsModule } from '../../tags/TagsModule'
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule'
import { TasksModule } from '../../tasks/TasksModule'
import { ListsModule } from '../../lists/ListsModule'
import { ProjectsModule } from '../../projects/ProjectsModule'
import { OrganizationsModule } from '../../organizations/OrganizationsModule'
import { PostgresTaskProvider } from '../../postgresDataProvider/PostgresTaskProvider'
import { Id } from '../../common/identifier'

import Table from '../../db/Table'
import { CustomFieldTargetType, ListDbRow, TaskDbRow, TaskRole } from '../../db/schema'
import { ExtensionsModule } from '../../extensions/ExtensionsModule'
import { CustomFieldServiceInterface } from '../../extensions/interfaces/CustomFieldServiceInterface'
import { ExtensionServiceInterface } from '../../extensions/interfaces/ExtensionServiceInterface'
import { ExtensionNamespace } from '../../extensions/types'
import { extractCustomFieldValuesFromData } from '../../../../../utils'
import { CSVExporterInterface } from '../interfaces/CSVExporterInterface'
import { ExportModule } from '../ExportModule'
import { CommonModule } from '../../common/CommonModule'
import { UrlGeneratorInterface } from '../../common/UrlGenerator'
import * as format from 'date-fns/format'
import { ChecklistItemServiceInterface } from '../../checklist/ChecklistItemServiceInterface'
import { ChecklistModule } from '../../checklist/ChecklistModule'
import { getListsQueryDecorator } from '../../internal/queryDecorators'
import { DbModule } from '../../db/DbModule'
import { ConnectionInterface } from '../../db/ConnectionInterface'
import { ProjectTasksQueryParams } from '../../tasks/types'
import { ProjectTasksProviderInterface } from '../../projects/interfaces/ProjectTasksProviderInterface'
import { ProjectTasksResource } from '../../projects/resources/ProjectTasksResource'

const AVAILABLE_OUTPUT_FORMATS = [
  ExportOutputFormat.CSV,
]

const requiredTaskFields = [
  'id',
  'name',
  'description',
  'startDate',
  'dueDate',
  'taskListId',
  'progress',
  'isArchived',
]

@injectable()
export class BoardCardsExporter
  extends AbstractDataExporter<BoardCardsParams, BoardCardsContext, BoardCardsExportResult>
  implements ExportDataProviderInterface<BoardCardsParams, BoardCardsContext, BoardCardsExportResult> {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(TagsModule.TagServiceInterface)
    protected tagService: TagServiceInterface,
    @inject(TasksModule.TaskServiceInterface)
    protected taskService: TaskServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
    protected taskProvider: PostgresTaskProvider,
    @inject(ListsModule.ListProviderInterface)
    protected listProvider: ListProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    protected projectProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ProjectTasksProviderInterface)
    protected projectTasksProvider: ProjectTasksProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    protected userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    protected userInProjectProvider: UserInProjectProviderInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    protected customFieldService: CustomFieldServiceInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface)
    protected extensionService: ExtensionServiceInterface,
    @inject(ExportModule.CSVExporterInterface)
    protected csvExporter: CSVExporterInterface,
    @inject(CommonModule.UrlGenerator)
    protected urlGenerator: UrlGeneratorInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    protected checklistItemService: ChecklistItemServiceInterface,
    @inject(ProjectsModule.ProjectTasksResource)
    protected projectTasksResource: ProjectTasksResource,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    super(logger)
    this.exporterType = ExporterType.BOARD_CARDS_EXPORTER
  }

  protected isAbleToExport(dataType: ExportDataType, format: ExportOutputFormat): boolean {
    return dataType === ExportDataType.BOARD_CARDS && AVAILABLE_OUTPUT_FORMATS.includes(format)
  }

  protected async isPermitted(params: BoardCardsParams): Promise<boolean> {
    const { organizationId, userId, projectId } = params
    if (!userId) {
      return false
    }

    const projectPromise = this.projectProvider.getProject(projectId)
    const userInProjectPromise = this.userInProjectProvider.getUserInProject(userId, projectId)
    const userInOrganizationPromise = this.userInOrganizationProvider.getUserInOrganization(userId, organizationId)
    const [
      project,
      userInProject,
      userInOrganization,
    ] = await Promise.all([
      projectPromise,
      userInProjectPromise,
      userInOrganizationPromise,
    ])

    return userInOrganization
      && project
      && project.isPrivate
      ? !isNil(userInProject)
      : true

  }

  async getContext(params: BoardCardsParams): Promise<GetContextResult<BoardCardsContext>> {
    const { projectId, exportArchivedCards = false } = params
    const {
      boardTasks,
      boardLists
    } = await this.getFilteredBoardListsAndTasks(projectId, exportArchivedCards)

    const listNamesByListIds = this.getBoardListNamesByListIds(boardLists)
    const taskIds = boardTasks.map(task => task.id)

    const taskEstimatesExtensionDataPromise = this.customFieldService.getValuesForTargetIds(CustomFieldTargetType.TASK, taskIds, ExtensionNamespace.AGILE)
    const taskEstimatesExtensionPromise = this.extensionService.getExtensionByNamespace(ExtensionNamespace.AGILE)
    const boardTaskAssigneeEmailsMapPromise = this.getBoardTasksAssigneeEmails(taskIds)
    const taskTagsMapPromise = this.tagService.getTasksTags(taskIds)
    const projectPromise = this.projectProvider.getProject(projectId)
    const tasksChecklistItemsPromise = this.checklistItemService.getTasksChecklistItems(taskIds)
    const [
      project,
      taskTagsMap,
      boardTaskAssigneeEmailsMap,
      taskEstimatesExtensionData,
      taskEstimatesExtension,
      tasksChecklistItems,
    ] = await Promise.all([
      projectPromise,
      taskTagsMapPromise,
      boardTaskAssigneeEmailsMapPromise,
      taskEstimatesExtensionDataPromise,
      taskEstimatesExtensionPromise,
      tasksChecklistItemsPromise,
    ])

    if (!project) {
      return {
        status: GetContextStatus.OBJECT_NOT_FOUND,
      }
    }

    const { id: extensionId } = taskEstimatesExtension
    const taskEstimates: TaskEstimatesMap = extractCustomFieldValuesFromData(taskEstimatesExtensionData.values, `estimatedEffort.${extensionId}`)


    const data: BoardCardsContext = {
      tasks: boardTasks,
      listNamesByListIds,
      project,
      tagsDataByTaskIds: taskTagsMap,
      boardTaskAssigneeEmailsMap,
      taskEstimates,
      tasksChecklistItems,
    }

    return {
      status: GetContextStatus.OK,
      data
    }

  }

  formatOutput(format: ExportOutputFormat, context: BoardCardsContext): BoardCardsExportResult {
    switch (format) {
      case ExportOutputFormat.CSV: {
        return this.getCSVData(context)
      }
      default: throw new Error('Unimplemented format type')
    }
  }

  handleResponse(res: Response, result: BoardCardsExportResult): void {
    res.status(200).send(result)
  }

  async getFilteredBoardListsAndTasks(projectId: Id, exportArchivedCards: boolean): Promise<{
    boardTasks: Partial<TaskDbRow>[],
    boardLists: ListDbRow[]
  }> {
    const queryParams: ProjectTasksQueryParams = {
      fetchArchived: exportArchivedCards,
      fields: requiredTaskFields.join(',')
    }
    const listsQueryDecorator = getListsQueryDecorator(queryParams)
    const project = await this.projectProvider.getProject(projectId)

    const projectTasksResourcePromise = this.projectTasksResource.getData(queryParams, { project })

    const boardListsPromise = this.listProvider.getProjectLists(projectId, null, listsQueryDecorator)

    const [
      projectTasksResource,
      boardLists
    ] = await Promise.all([
      projectTasksResourcePromise,
      boardListsPromise
    ])

    return {
      boardTasks: projectTasksResource.tasks,
      boardLists,
    }
  }

  private getBoardListNamesByListIds(boardLists: ListDbRow[]): ListNamesByListIds {
    return boardLists.reduce((acc, list) => {
      acc[list.id] = list.name
      return acc
    }, {})
  }

  private async getBoardTasksAssigneeEmails(taskIds: Id[]): Promise<BoardTaskAssigneeEmailsMap> {
    const res = await this.connection.getQueryBuilder()
      .select(`${Table.USER}.email`, `${Table.USER_IN_TASK}.taskId`)
      .from(Table.USER_IN_TASK)
      .join(Table.USER, `${Table.USER_IN_TASK}.userId`, `${Table.USER}.id`)
      .whereIn(`${Table.USER_IN_TASK}.taskId`, taskIds)
      .andWhere({
        [`${Table.USER_IN_TASK}.role`]: TaskRole.ASSIGNEE,
        [`${Table.USER}.isBot`]: false,
      })

    return res.reduce((acc, { email, taskId }) => {
      if (acc[taskId]) {
        acc[taskId].push(email)
      } else {
        acc[taskId] = [email]
      }

      return acc
    }, {})
  }


  private getCSVData(context: BoardCardsContext): BoardCardsExportResult {
    const {
      tasks,
      listNamesByListIds,
      project,
      tagsDataByTaskIds,
      boardTaskAssigneeEmailsMap,
      taskEstimates,
      tasksChecklistItems,
    } = context

    const source = tasks.map(task => {
      const taskTagsData = tagsDataByTaskIds[task.id]
      const taskAssigneesEmailsData = boardTaskAssigneeEmailsMap[task.id]

      const tagsNames = this.csvExporter.formatMultipleValuesCell(taskTagsData, 'name')
      const taskChecklistItems = this.csvExporter.formatMultipleValuesCell(tasksChecklistItems[task.id], 'name')
      const taskAssigneesEmails = this.csvExporter.formatMultipleValuesCell(taskAssigneesEmailsData)

      return {
        taskName: task.name,
        listName: listNamesByListIds[task.taskListId],
        tags: tagsNames,
        progress: `${task.progress ? task.progress : 0}%`,
        taskAssigneesEmails,
        estimate: taskEstimates[task.id],
        startDate: task.startDate ? format(task.startDate, 'YYYY-MM-DD HH:mm') : '',
        dueDate: task.dueDate ? format(task.dueDate, 'YYYY-MM-DD HH:mm') : '',
        taskChecklistItems,
        description: task.description,
      }
    })

    const fields = [
      {
        label: 'Title',
        value: 'taskName',
        default: '',
      },
      {
        label: 'List',
        value: 'listName',
        default: '',
      },
      {
        label: 'Tags',
        value: 'tags',
        default: '',
      },
      {
        label: 'Assignees',
        value: 'taskAssigneesEmails',
        default: '',
      },
      {
        label: 'Estimate',
        value: 'estimate',
        default: '',
      },
      {
        label: 'Progress',
        value: 'progress',
        default: '0%',
      },
      {
        label: 'Start date',
        value: 'startDate',
        default: '',
      },
      {
        label: 'Due date',
        value: 'dueDate',
        default: '',
      },
      {
        label: 'Checklist',
        value: 'taskChecklistItems',
        default: '',
      },
      {
        label: 'Description',
        value: 'description',
        default: '',
      },
    ]


    const csv = this.csvExporter.render(source, { fields })
    return {
      filename: `${project.name}.csv`,
      csv
    }
  }
}

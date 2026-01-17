import { AbstractDataExporter } from '../AbstractDataExporter';
import {
  ExportDataType,
  ExportOutputFormat,
  GetContextResult,
  GetContextStatus,
  CalendarExportContex,
  CalendarParams,
  ExporterType,
} from '../types';
import { inject, injectable } from 'inversify';
import { TaskProviderInterface } from '../../tasks/interfaces/TaskProviderInterface';
import { FormatProviderFactoryInterface } from '../interfaces/FormatProviderFactoryInterface';
import { TaskDbRow, CustomFieldTargetType } from '../../db/schema';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import { OrganizationServiceInterface } from '../../organizations/interfaces/OrganizationServiceInterface';
import { ExportDataProviderInterface } from '../interfaces/ExportDataProviderInterface';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { Response } from 'express';
import * as ical from 'ical-generator';
import { CustomFieldServiceInterface } from '../../extensions/interfaces/CustomFieldServiceInterface';
import { get } from 'lodash';
import { UserInOrganizationProviderInterface } from '../../organizations/interfaces/UserInOrganizationProviderInterface';
import { IcalFormatProvider } from '../formatProviders/IcalFormatProvider';
import { CalendarProviderInterface } from '../interfaces/CalendarProviderInterface';
import { TasksModule } from '../../tasks/TasksModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { ExportModule } from '../ExportModule';
import { CommonModule } from '../../common/CommonModule';
import { OrganizationsModule } from '../../organizations/OrganizationsModule';
import { ExtensionsModule } from '../../extensions/ExtensionsModule';
import { ExtensionNamespace } from '../../extensions/types';
import { ServerResponse } from 'http';

const AVAILABLE_OUTPUT_FORMATS = [ExportOutputFormat.ICAL];

/*
 * This calendar extension should be in separate project with separate backend
 */
@injectable()
export class CalendarExporter
  extends AbstractDataExporter<CalendarParams, CalendarExportContex, ical.ICalCalendar>
  implements ExportDataProviderInterface<CalendarParams, CalendarExportContex, ical.ICalCalendar>
{
  protected taskProvider: TaskProviderInterface;
  protected formatProviderFactory: FormatProviderFactoryInterface;
  protected timeService: TimeServiceInterface;
  protected organizationService: OrganizationServiceInterface;
  protected customFieldService: CustomFieldServiceInterface;
  protected userInOrganizationProvider: UserInOrganizationProviderInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(TasksModule.TaskProviderInterface)
    taskProvider: TaskProviderInterface,
    @inject(ExportModule.FormatProviderFactoryInterface)
    formatProviderFactory: FormatProviderFactoryInterface,
    @inject(CommonModule.TimeServiceInterface)
    timeService: TimeServiceInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    organizationService: OrganizationServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    customFieldService: CustomFieldServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    userInOrganizationProvider: UserInOrganizationProviderInterface
  ) {
    super(logger);
    this.taskProvider = taskProvider;
    this.formatProviderFactory = formatProviderFactory;
    this.timeService = timeService;
    this.organizationService = organizationService;
    this.customFieldService = customFieldService;
    this.userInOrganizationProvider = userInOrganizationProvider;
    this.exporterType = ExporterType.CALENDAR_EXPORTER;
  }

  protected isAbleToExport(dataType: ExportDataType, format: ExportOutputFormat): boolean {
    return dataType === ExportDataType.CARD_DUE_DATES && AVAILABLE_OUTPUT_FORMATS.includes(format);
  }

  protected async isPermitted(params: CalendarParams): Promise<boolean> {
    const { userInOrganizationId, key } = params;

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId);

    if (!userInOrganization) {
      return false;
    }

    const result = await this.customFieldService.getValues(
      CustomFieldTargetType.USER_IN_ORGANIZATION,
      userInOrganizationId,
      ExtensionNamespace.CALENDAR_SYNC
    );
    const syncKey = get(result, `values.${ExtensionNamespace.CALENDAR_SYNC}.syncToken`);
    if (syncKey === key) {
      return true;
    }
    return false;
  }

  async getContext(params: CalendarParams): Promise<GetContextResult<CalendarExportContex>> {
    const { userInOrganizationId } = params;

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId);

    if (!userInOrganization) {
      return {
        status: GetContextStatus.OBJECT_NOT_FOUND,
      };
    }

    const { userId, organizationId } = userInOrganization;

    const organizationResult = await this.organizationService.getOrganization(organizationId);

    if (!organizationResult.organization) {
      return {
        status: GetContextStatus.OBJECT_NOT_FOUND,
      };
    }

    const tasks = await this.taskProvider.getUserTasksWithDueOrStartDates(userId, organizationId);

    const context: CalendarExportContex = {
      organization: organizationResult.organization,
      tasks,
    };

    return {
      status: GetContextStatus.OK,
      data: context,
    };
  }

  formatOutput(format: ExportOutputFormat, context: CalendarExportContex): ical.ICalCalendar {
    switch (format) {
      case ExportOutputFormat.ICAL: {
        return this.getIcalData(context);
      }
      default:
        throw new Error('Unimplemented format type');
    }
  }

  getIcalData(context: CalendarExportContex): ical.ICalCalendar {
    const icalFormatProvider =
      this.formatProviderFactory.getFormatProvider<CalendarProviderInterface>(IcalFormatProvider);
    const { organization, tasks } = context;

    const calendar = icalFormatProvider.createCalendar({
      name: `TimeCamp Planner - ${organization.name}`,
      company: organization.name,
      product: organization.name,
    });

    tasks.forEach((task: TaskDbRow) => {
      const allDay = !task.startDate || !task.dueDate;
      icalFormatProvider.createEvent(calendar, {
        title: task.name,
        start: task.startDate || task.dueDate,
        end: task.dueDate || task.startDate,
        allDay,
        description: task.description,
      });
    });
    return calendar;
  }

  handleResponse(res: Response, result: ical.ICalCalendar): void {
    result.serve(res as ServerResponse, 'calendar.ics');
  }
}

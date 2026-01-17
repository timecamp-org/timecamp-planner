import { inject, injectable } from 'inversify';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import { MessageDbRow, ProjectType } from '../db/schema';
import { FilesModule } from '../files/FilesModule';
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface';
import { PaginationModule } from '../pagination/PaginationModule';
import { PaginationServiceInterface } from '../pagination/interfaces/PaginationServiceInterface';
import { StandardPaginationToken, StandardPaginatorOptions } from '../pagination/types';
import {
  DEFAULT_ENTITIES_PAGINATION_COLUMNS,
  DEFAULT_SEARCH_ORDER_BY_OPTIONS,
  ORDER_BY_COLUMN_BY_ENTITY_TYPE,
  PAGINATION_COLUMNS_BY_ENTITY_TYPE,
} from './constants';
import { EntityPropsType, SearchServiceInterface } from './interfaces/SearchServiceInterface';

import { handleEntityDistanceSelector } from './helpers';
import { SearchEntitiesPropsType, SearchMessageResult, SearchMessageStatus } from './types';

import { EntityStatus, EntityType } from '../common/enum';
import { Id } from '../common/identifier';
import Table from '../db/Table';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProvider } from '../organizations/dataProviders/UserInOrganizationProvider';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';

@injectable()
export class SearchService implements SearchServiceInterface {
  constructor(
    @inject(PaginationModule.StandardPaginationService)
    private standardPaginationService: PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,

    @inject(FilesModule.FileProviderInterface)
    protected fileProvider: FileProviderInterface,

    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    protected projectProvider: ProjectProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    protected userInOrganizationProvider: UserInOrganizationProvider
  ) {}

  public async searchEntities(props: SearchEntitiesPropsType): Promise<SearchMessageResult> {
    const { searchPhrase, entityType } = props;

    const notEnoughFilterParams =
      (!searchPhrase && !entityType) || (!searchPhrase && entityType === EntityType.Message);

    if (notEnoughFilterParams) {
      return {
        status: SearchMessageStatus.OK,
        results: { results: [], nextPage: null },
      };
    }

    let results;
    if (!entityType) {
      results = await this.handleSearchEntities(props);
      return {
        status: SearchMessageStatus.OK,
        results,
      };
    }

    switch (entityType) {
      case EntityType.Message:
        results = await this.handleSearchEntityMessage(props);
        break;

      case EntityType.Task:
        results = await this.handleSearchEntityTask(props);
        break;

      case EntityType.Project:
        results = await this.handleSearchEntityProject(props);
        break;

      case EntityType.File:
        results = await this.handleSearchEntityFile(props);
        break;

      case EntityType.User:
        results = await this.handleSearchEntityUser(props);
        break;
    }
    return {
      status: SearchMessageStatus.OK,
      results,
    };
  }

  async getUserAllowedProjects(userId: Id, organizationId: Id, archived: boolean = false) {
    const kwargs = archived
      ? {}
      : {
          status: EntityStatus.EXISTS,
        };

    const allowedProjectIds = await this.connection
      .getConnection()
      .select('projectId')

      .from(Table.USER_IN_PROJECT)
      .where({ userId })
      .whereIn('projectId', function () {
        this.select('id')
          .from(Table.PROJECT)
          .where({ organizationId, ...kwargs });
      })
      .pluck('project_id');

    return allowedProjectIds;
  }

  async getUserAllowedTasks(allowedProjectIds: Id[], archived: boolean = false) {
    const userALlowedTasksQuery = this.connection
      .getConnection()
      .select('id')
      .from(Table.TASK)
      .whereIn('projectId', allowedProjectIds);

    if (!archived) {
      userALlowedTasksQuery.where({
        isArchived: false,
      });
    }

    const allowedTaskIds = await userALlowedTasksQuery.pluck('id');
    return allowedTaskIds;
  }

  getSelectedColumns(entityType: EntityType) {
    const c = this.connection.getConnection();
    const orderByColumnName = ORDER_BY_COLUMN_BY_ENTITY_TYPE[entityType];
    const selectedColumns = [
      c.raw('tbn.id'),
      c.raw('tbn.*'),
      c.raw(`'${entityType}' as entity_type`),
      c.raw(`${orderByColumnName} as created_at`),
    ];

    return selectedColumns;
  }

  async handleSearchEntityMessage({ userId, organizationId, searchPhrase, archived, limit, page }) {
    const c = this.connection.getConnection();

    const paginationColumnNames = PAGINATION_COLUMNS_BY_ENTITY_TYPE[EntityType.Message];
    let selectedColumns = this.getSelectedColumns(EntityType.Message);

    const userAllowedProjectIds = await this.getUserAllowedProjects(userId, organizationId, archived);

    const userAllowedTaskIds = await this.getUserAllowedTasks(userAllowedProjectIds, archived);

    const messagesSearchQuery = c
      .table(Table.MESSAGE)
      .select(selectedColumns)
      .from(`${Table.MESSAGE} as tbn`)
      .where((queryBuilder) => {
        queryBuilder.andWhere('organizationId', organizationId);
        if (searchPhrase) {
          queryBuilder.whereRaw(
            `(container_type='project' and container_id = ANY(:userAllowedProjectIds) and content ilike :searchPhrase and content is not null)
        or (container_type='task' and container_id = any(:userAllowedTaskIds) and content ilike :searchPhrase and content is not null)
        `,
            {
              userAllowedProjectIds,
              userAllowedTaskIds,
              searchPhrase: `%${searchPhrase}%`,
            }
          );
        }
      });

    messagesSearchQuery.orderBy('content', 'asc')

    const paginator = this.standardPaginationService.getPaginator(page, {
      limit,
      columns: paginationColumnNames,
    });
    const { results, nextPage } = await paginator.execute<MessageDbRow>(messagesSearchQuery);

    return {
      nextPage,
      results: results.map((row) => {
        return {
          entityType: EntityType.Message,
          createdAt: row.createdAt,
          entity: row,
        };
      }),
    };
  }
  async handleSearchEntityTask({ userId, organizationId, archived, searchPhrase, page, limit }) {
    const c = this.connection.getConnection();

    let selectedColumns = this.getSelectedColumns(EntityType.Task);
    const userInProjectIds = await this.getUserAllowedProjects(userId, organizationId);
    const tasksSearchQuery = c
      .table(Table.TASK)
      .select(selectedColumns)
      .from(`${Table.TASK} as tbn`)
      .leftJoin(`${Table.ACTIVITY_TARGET_TASK} as att`, 'tbn.id', 'att.task_id')
      .join(`${Table.ACTIVITY} as a`, function () {
        this.on('att.activity_id', 'a.id').andOnVal('a.type', '=', 'create');
      })
      .where((queryBuilder) => {
        queryBuilder.whereIn('projectId', userInProjectIds);

        if (!archived) {
          queryBuilder.where('isArchived', false);
        }

        queryBuilder.whereRaw(
          `exists (select from unnest(string_to_array(name, ' ')) element where :searchPhrase % element)`,
          { searchPhrase }
        );
      });

      
      tasksSearchQuery.orderBy('name', 'asc')

    const paginator = this.standardPaginationService.getPaginator(page, {
      limit,
      columns: PAGINATION_COLUMNS_BY_ENTITY_TYPE[EntityType.Task],
    });
    const { results, nextPage } = await paginator.execute<MessageDbRow>(tasksSearchQuery);

    return {
      nextPage,
      results: results.map((row) => {
        return {
          entityType: EntityType.Task,
          createdAt: row.createdAt,
          entity: row,
        };
      }),
    };
  }
  async handleSearchEntityProject({ userId, organizationId, archived, searchPhrase, limit, page }) {
    const c = this.connection.getConnection();

    let selectedColumns = this.getSelectedColumns(EntityType.Project);

    const userInProjectIds = await this.getUserAllowedProjects(userId, organizationId, archived);

    const projectsSearchQuery = c
      .table(Table.PROJECT)
      .select(selectedColumns)
      .from(`${Table.PROJECT} as tbn`)
      .where((queryBuilder) => {
        queryBuilder.andWhereNot('project_type', ProjectType.DIRECT_CHAT);
        queryBuilder.andWhereNot('project_type', ProjectType.GROUP_CHAT);
        queryBuilder.andWhere('organizationId', organizationId);

        queryBuilder.andWhereRaw(`tbn.id = ANY(:projectIds)`, {
          projectIds: userInProjectIds,
        });

        if (searchPhrase) {
          queryBuilder.whereRaw(
            `exists (select from unnest(string_to_array(name, ' ')) element where :searchPhrase % element)`,
            { searchPhrase }
          );
        }
      });

    projectsSearchQuery.orderBy('name', 'asc')    

    const paginator = this.standardPaginationService.getPaginator(page, {
      limit,
      columns: PAGINATION_COLUMNS_BY_ENTITY_TYPE[EntityType.Project],
    });
    const { results, nextPage } = await paginator.execute<MessageDbRow>(projectsSearchQuery);

    return {
      nextPage,
      results: results.map((row) => {
        return {
          entityType: EntityType.Project,
          createdAt: row.createdAt,
          entity: row,
        };
      }),
    };
  }
  async handleSearchEntityFile({ userId, organizationId, archived, searchPhrase, page, limit }) {
    const c = this.connection.getConnection();

    let selectedColumns = this.getSelectedColumns(EntityType.File);

    const userInProjectIds = await this.getUserAllowedProjects(userId, organizationId, archived);

    const userAllowedTaskIds = await this.getUserAllowedTasks(userInProjectIds, archived);

    const filesSearchQuery = c
      .table(Table.FILE)
      .select(selectedColumns)
      .from(`${Table.FILE} as tbn`)
      .leftJoin(`${Table.MESSAGE_FILE} as mf`, 'tbn.id', 'mf.file_id')
      .leftJoin(`${Table.MESSAGE} as m`, 'mf.message_id', 'm.id')
      .leftJoin(`${Table.PROJECT_FILE} as pf`, 'tbn.id', 'pf.file_id')
      .where((queryBuilder) => {
        queryBuilder.andWhere('tbn.organizationId', organizationId);

        queryBuilder.andWhereRaw(
          "(pf.project_id is not null and pf.project_id=ANY(:projectIds) and tbn.name ilike :searchPhrase) or (m.container_id is not null and m.container_type='project' and m.container_id =ANY(:projectIds) and tbn.name ilike :searchPhrase) or (m.container_id is not null and m.container_type='task' and m.container_id=ANY(:userAllowedTaskIds) and tbn.name ilike :searchPhrase)",
          {
            projectIds: userInProjectIds,
            userAllowedTaskIds: userAllowedTaskIds,
            searchPhrase: `%${searchPhrase}%`,
          }
        );
        if (searchPhrase) {
          queryBuilder.whereRaw(
            `exists (select from unnest(string_to_array(name, ' ')) element where :searchPhrase % element)`,
            { searchPhrase }
          );
        }
      });

    filesSearchQuery.orderBy('name', 'asc')   
    
    const paginator = this.standardPaginationService.getPaginator(page, {
      limit,
      columns: PAGINATION_COLUMNS_BY_ENTITY_TYPE[EntityType.File],
    });
    const { results, nextPage } = await paginator.execute<MessageDbRow>(filesSearchQuery);

    return {
      nextPage,
      results: results.map((row) => {
        return {
          entityType: EntityType.File,
          createdAt: row.createdAt,
          entity: row,
        };
      }),
    };
  }
  async handleSearchEntityUser({ organizationId, searchPhrase, page, limit }) {
    const userIds = await this.userInOrganizationProvider.getOrganizationUserIds(organizationId);

    const c = this.connection.getConnection();

    let selectedColumns = this.getSelectedColumns(EntityType.User);

    const queryResults = c
      .table(Table.USER)
      .select(selectedColumns)
      .from(`${Table.USER} as tbn`)
      .where((queryBuilder) => {
        if (searchPhrase) {
          queryBuilder.orWhereRaw(` nickname % :searchPhrase `, {
            searchPhrase,
          });
          queryBuilder.orWhereRaw(` first_name % :searchPhrase `, {
            searchPhrase,
          });
          queryBuilder.orWhereRaw(` last_name % :searchPhrase `, {
            searchPhrase,
          });
        }
      });

    if (searchPhrase) {
      queryResults.orderByRaw(handleEntityDistanceSelector(EntityType.User, searchPhrase));
    } else {
      queryResults.orderBy([DEFAULT_SEARCH_ORDER_BY_OPTIONS]);
    }

    queryResults.whereIn('id', userIds);

    const paginator = this.standardPaginationService.getPaginator(page, {
      limit,
      columns: PAGINATION_COLUMNS_BY_ENTITY_TYPE[EntityType.User],
    });
    const { results, nextPage } = await paginator.execute<MessageDbRow>(queryResults);

    return {
      nextPage,
      results: results.map((row) => {
        const { passwordHash, ...restOfRow } = row as unknown as any;
        return {
          entityType: EntityType.User,
          createdAt: row.createdAt,
          entity: {
            ...restOfRow,
          },
        };
      }),
    };
  }

  async handleSearchEntities({ searchPhrase, organizationId, page, limit, userId }: EntityPropsType) {
    const c = this.connection.getConnection();

    const userInProjectIds = await this.getUserAllowedProjects(userId, organizationId);

    const userAllowedTaskIds = await this.getUserAllowedTasks(userInProjectIds);
    const userIds = await this.userInOrganizationProvider.getOrganizationUserIds(organizationId);

    const queryResults = c
      .with('words', ['w'], c.raw('(values(?))', searchPhrase))
      .with(
        'mm',
        c.raw(
          `select m.* from messages.message as m, words where m.organization_id = :organizationId
            and (container_type='project' and container_id = ANY(:userInProjectIds)  and exists (select from unnest(string_to_array(content, ' ')) element where :searchPhrase % element) and content is not null)
            or (container_type='task' and container_id = any(:userAllowedTaskIds)  and exists (select from unnest(string_to_array(content, ' ')) element where :searchPhrase % element ) and content is not null)
                 
                
            `,
          {
            organizationId,
            userAllowedTaskIds,
            userInProjectIds,
            searchPhrase,
          }
        )
      )
      .with(
        'mt',
        c.raw(
          `select t.*, a.created_at from "project-management".task as t left join notifications.activity_target_task att on t.id=att.task_id join notifications.activity a on att.activity_id=a.id and a.type='create', words where t.project_id = ANY(:userInProjectIds) and exists (select from unnest(string_to_array(name, ' ')) element where :searchPhrase % element)`,
          { userInProjectIds, searchPhrase }
        )
      )

      .with(
        'mf',
        c.raw(
          `select f.* from messages.file as f left join messages.message_file as mf on f.id= mf.file_id  left join messages.message m on mf.message_id=m.id left join "project-management".project_file as pf on f.id=pf.file_id, words where f.organization_id = :organizationId and (pf.project_id is not null and pf.project_id=ANY(:projectIds) and f.name ilike :searchPhrase) or (m.container_id is not null and m.container_type='project' and m.container_id =ANY(:projectIds) and f.name ilike :searchPhrase) or (m.container_id is not null and m.container_type='task' and m.container_id=ANY(:userAllowedTaskIds) and f.name ilike :searchPhrase)`,
          { organizationId, projectIds: userInProjectIds, userAllowedTaskIds: userAllowedTaskIds, searchPhrase }
        )
      )
      .with(
        'mp',
        c.raw(
          `select u.* from core.user as u, words  where id = ANY(:userIds) and  (   u.nickname % words.w or  u.first_name % words.w or u.last_name % words.w  )`,
          { userIds }
        )
      )
      .with(
        'mpr',
        c.raw(
          `select p.* from "project-management".project as p, words where  p.project_type != 'direct-chat' and p.project_type!='group-chat' and organization_id = ?  and exists (select from unnest(string_to_array(name, ' ')) element where :searchPhrase % element )  `,
          organizationId,

          searchPhrase
        )
      )
      .select([
        c.raw('mm.id id'),
        c.raw('(select to_jsonb(a) from (select mm.*  ) a ) entity'),
        c.raw('mm.created_at as created_at'),
        c.raw("'message' as entity_type"),
      ])
      .from('mm')
      .union([
        c
          .select([
            c.raw('mt.id'),
            c.raw('(select to_jsonb(a) from (select mt.* ) a )'),
            c.raw('mt.created_at as created_at'),
            c.raw("'task'"),
          ])
          .from('mt'),

        c
          .select([
            c.raw('mf.id'),
            c.raw('(select to_jsonb(a) from (select mf.* ) a )'),
            c.raw('mf.created_at'),
            c.raw("'file'"),
          ])
          .from('mf'),
        c
          .select([
            c.raw('mp.id'),
            c.raw("(select to_jsonb(a) from (select mp.* ) a ) - '{password_hash, ip_address}'::text[]"),
            c.raw('mp.created_at'),
            c.raw("'user'"),
          ])
          .from('mp'),

        c
          .select([
            c.raw('mpr.id'),
            c.raw('(select to_jsonb(a) from (select mpr.* ) a )'),
            c.raw('mpr.start_date'),
            c.raw("'project'"),
          ])
          .from('mpr'),
      ])
      .orderBy([DEFAULT_SEARCH_ORDER_BY_OPTIONS]);

    const paginator = this.standardPaginationService.getPaginator(page, {
      limit,
      columns: DEFAULT_ENTITIES_PAGINATION_COLUMNS,
    });

    const results = await paginator.execute<MessageDbRow>(queryResults);

    return results;
  }
}

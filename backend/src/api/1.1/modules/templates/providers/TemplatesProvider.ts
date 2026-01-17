import { inject, injectable } from 'inversify';
import { first } from 'lodash';
import { Id } from '../../common/identifier';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { TemplateProviderInterface } from '../interfaces/TemplateProviderInterface';

import { templateEntityParentRelationIdNamesByTable } from '../const';

@injectable()
export class TemplateProvider implements TemplateProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    protected connection: ConnectionInterface
  ) {}

  async getTemplateEntity(table: Table, templateId: Id, userOrganizationIds: Id[] = null) {
    const results = await this.handleGetTemplateEntities(table, userOrganizationIds, templateId);

    return first(results);
  }

  async getTemplateEntities(table: Table, userOrganizationIds: Id[]) {
    const results = await this.handleGetTemplateEntities(table, userOrganizationIds, null);

    return results;
  }

  async handleGetTemplateEntities(table: Table, userOrganizationIds: Id[], templateId: Id) {
    let results;
    switch (table) {
      case Table.PROJECT_TEMPLATE:
        results = await this.handleProjectTemplate(userOrganizationIds, templateId);
        break;
      case Table.TASK_LIST_TEMPLATE:
        results = await this.handleTaskListTemplate(userOrganizationIds, templateId);
        break;
      case Table.TASK_TEMPLATE:
        results = await this.handleTaskTemplate(userOrganizationIds, templateId);
        break;
      case Table.CHECKLIST_ITEM_TEMPLATE:
        results = await this.handleChecklistItemTemplate(userOrganizationIds, templateId);
        break;
      default:
        throw new Error(`Not supported entity table type ${table}`);
    }

    return results;
  }

  async handleProjectTemplate(userOrganizationIds, id = null) {
    const c = this.connection.getConnection();

    const query = c
      .with(
        'cit_json',
        c.raw(`    select task_template_id, to_jsonb(t) as checklist_item_template
    from templates.checklist_item_template t`)
      )
      .with(
        'cit_raw',
        c.raw(`  select tt.id, tt.task_list_template_id, tt.name, tt.order, coalesce (jsonb_agg(cit.checklist_item_template) FILTER (where cit.checklist_item_template is not null), '[]' )  as checklist_item_templates,
        (select jsonb_agg(tgt) from  templates.tag_template tgt where tgt.id in (select ttht.tag_template_id from templates.task_template_has_tag ttht where ttht.task_template_id = tt.id)     ) as tag_templates 
         from templates.task_template tt
         left join cit_json cit on cit.task_template_id = tt.id 
         group by tt.id, tt.task_list_template_id, tt.name`)
      )
      .with(
        'tt_json',
        c.raw(` select task_list_template_id, to_jsonb(t) as task_template
      from cit_raw t`)
      )
      .with(
        'tlt_raw',
        c.raw(` select tlt.id, tlt.name, tlt.order, tlt.project_template_id, COALESCE(jsonb_agg(tt.task_template) FILTER (WHERE tt.task_template is not null ), '[]') as task_templates
      from templates.task_list_template tlt
           left join tt_json tt on tt.task_list_template_id = tlt.id
     group by tlt.id, tlt.name, tlt.project_template_id`)
      )
      .with(
        'tlt_json',
        c.raw(` select project_template_id, to_jsonb(t) as task_list_template
     from tlt_raw t`)
      )
      .with(
        'project_template_raw',
        c.raw(`select pt.id, pt.name, pt.description, pt.organization_id, pt.project_id, pt.order,  COALESCE(jsonb_agg(tlt.task_list_template) FILTER (WHERE tlt.task_list_template is not null), '[]'  ) as task_list_templates
     from templates.project_template pt
          left join tlt_json tlt on tlt.project_template_id = pt.id      
    group by pt.id, pt.name, pt.description`)
      )
      .where('pt.organization_id', null)
      .select('*')
      .from('project_template_raw as pt');

    if (userOrganizationIds) {
      query.orWhereRaw('pt.organization_id = ANY(:userOrganizationIds)', { userOrganizationIds });
    }
    if (id) {
      query.andWhere('pt.id', id);
    }

    const results = await query;

    if (id) {
      return results.filter((template) => template.id === id);
    }

    return results;
  }
  async handleTaskListTemplate(userOrganizationIds, id = null) {
    const c = this.connection.getConnection();

    const query = c
      .with(
        'cit_json',
        c.raw(`    select task_template_id, to_jsonb(t) as checklist_item_template
     from templates.checklist_item_template t`)
      )
      .with(
        'cit_raw',
        c.raw(`    select tt.id, tt.task_list_template_id, tt.name, tt.order, coalesce (jsonb_agg(cit.checklist_item_template) FILTER (where cit.checklist_item_template is not null), '[]' )  as checklist_item_templates,
        (select jsonb_agg(tgt) from  templates.tag_template tgt where tgt.id in (select ttht.tag_template_id from templates.task_template_has_tag ttht where ttht.task_template_id = tt.id)     ) as tag_templates 
    from templates.task_template tt
         left join cit_json cit on cit.task_template_id = tt.id
   group by tt.id, tt.task_list_template_id, tt.name`)
      )
      .with(
        'tt_json',
        c.raw(`    select task_list_template_id, to_jsonb(t) as task_template
   from cit_raw t`)
      )
      .with(
        'tlt_raw',
        c.raw(`    select tlt.id, tlt.name, tlt.order, tlt.project_template_id, COALESCE(jsonb_agg(tt.task_template) FILTER (WHERE tt.task_template is not null ), '[]') as task_templates
   from templates.task_list_template tlt
        left join tt_json tt on tt.task_list_template_id = tlt.id   
  group by tlt.id, tlt.name, tlt.project_template_id`)
      )
      .select(['tlt.id', 'tlt.name', 'tlt.order', 'tlt.project_template_id', 'tlt.task_templates'])
      .from('tlt_raw as tlt')
      .leftJoin(`${Table.PROJECT_TEMPLATE} as pt`, function (qb) {
        qb.on('tlt.project_template_id', '=', 'pt.id');
      })
      .where('pt.organization_id', null);

    if (userOrganizationIds && id) {
      query.orWhereRaw(
        '(pt.organization_id = ANY(:userOrganizationIds) AND tlt.id = :id) OR  (pt.organization_id is null AND tlt.id=:id)',
        { userOrganizationIds, id }
      );
    } else if (userOrganizationIds) {
      query.orWhereRaw(' pt.organization_id = ANY(:userOrganizationIds) OR pt.organization_id is null', {
        userOrganizationIds,
      });
    } else if (id) {
      query.andWhere('tlt.id', id);
    }

    const results = await query;

    return results;
  }
  async handleTaskTemplate(userOrganizationIds, id = null) {
    const c = this.connection.getConnection();

    const query = c
      .with(
        'cit_json',
        c.raw(
          'select task_template_id, to_jsonb(t) as checklist_item_template from templates.checklist_item_template t   '
        )
      )
      .with(
        'tt_raw',
        c.raw(`    select tt.id, tt.task_list_template_id, tt.name, tt.order, tt.project_template_id , coalesce (jsonb_agg(cit.checklist_item_template) FILTER (where cit.checklist_item_template is not null), '[]' )  as checklist_item_templates,
        (select jsonb_agg(tgt) from  templates.tag_template tgt where tgt.id in (select ttht.tag_template_id from templates.task_template_has_tag ttht where ttht.task_template_id = tt.id)     ) as tag_templates 
        from templates.task_template tt
         left join cit_json cit on cit.task_template_id = tt.id      
   group by tt.id, tt.task_list_template_id, tt.name`)
      )
      .select([
        'tt.id',
        'tt.name',
        'tt.order',
        'tt.task_list_template_id',
        'tt.checklist_item_templates',
        'tt.project_template_id',
        'tt.tag_templates',
      ])
      .from('tt_raw as tt')
      .leftJoin(`${Table.PROJECT_TEMPLATE} as pt`, function (qb) {
        qb.on('pt.id', '=', 'tt.project_template_id');
      })
      .where('pt.organization_id', null);

    if (userOrganizationIds && id) {
      query.orWhereRaw(
        '(pt.organization_id = ANY(:userOrganizationIds) AND tt.id = :id) OR  (pt.organization_id is null AND tt.id=:id)',
        { userOrganizationIds, id }
      );
    } else if (userOrganizationIds) {
      query.orWhereRaw(' pt.organization_id = ANY(:userOrganizationIds) OR pt.organization_id is null', {
        userOrganizationIds,
      });
    } else if (id) {
      query.andWhere('tt.id', id);
    }

    const results = await query;

    return results;
  }

  async handleChecklistItemTemplate(userOrganizationIds, id = null) {
    const c = this.connection.getConnection();

    const query = c
      .select(['cit.id', 'cit.order', 'cit.name', 'cit.is_checked'])
      .from(`${Table.CHECKLIST_ITEM_TEMPLATE} as cit`)
      .leftJoin(`${Table.TASK_TEMPLATE} as tt`, function (qb) {
        qb.on('tt.id', '=', 'cit.task_template_id');
      })

      .leftJoin(`${Table.PROJECT_TEMPLATE} as pt`, function (qb) {
        qb.on('pt.id', '=', 'tt.project_template_id');
      })
      .whereRaw('pt.organization_id is null');
    if (userOrganizationIds && id) {
      query.orWhereRaw(
        '(pt.organization_id = ANY(:userOrganizationIds) AND cit.id = :id) OR  (pt.organization_id is null AND cit.id=:id)',
        { userOrganizationIds, id }
      );
    } else if (userOrganizationIds) {
      query.orWhereRaw(' pt.organization_id = ANY(:userOrganizationIds) OR pt.organization_id is null', {
        userOrganizationIds,
      });
    } else if (id) {
      query.andWhere('cit.id', id);
    }

    const result = await query;

    return result;
  }

  async getEntity<T>(table: Table, entityId: Id) {
    const query = this.connection.getConnection();
    const results = await query.table(table).where('id', entityId).select('*').first();

    return results as T;
  }

  async getTemplateEntitiesByQueryModifiers(table: Table, queryModifier = {}) {
    const query = this.connection.getConnection();
    const results = await query.table(table).where(queryModifier).select('*');
    return results;
  }

  async createTemplateEntity(templateEntityTable: Table, data, trx?: Transaction) {
    const query = this.connection.getQueryWithTransaction(trx);
    const result = await query.table(templateEntityTable).insert(data).returning('*').then(first);

    return result;
  }

  async createTemplateEntities(templateEntityTable: Table, data, trx?: Transaction) {
    const query = this.connection.getConnection();

    const result = await query.table(templateEntityTable).insert(data).returning('*');

    return result;
  }

  async updateTemplateEntity(templateEntityTable: Table, id: Id, data, trx?: Transaction) {
    const query = this.connection.getQueryWithTransaction(trx);

    const result = await query.table(templateEntityTable).where({ id }).update(data).returning('*').then(first);

    return result;
  }

  async deleteTemplateEntity(entityTable: Table, templateId: string): Promise<number> {
    const query = this.connection.getConnection();

    return await query.table(entityTable).where('id', templateId).del();
  }

  async deleteCascadeTemplateEntityChildren(entityTable: Table, templateId: string) {
    const query = this.connection.getConnection();

    const relatedName = templateEntityParentRelationIdNamesByTable[entityTable];

    return await query.table(entityTable).where(relatedName, templateId).del();
  }
}

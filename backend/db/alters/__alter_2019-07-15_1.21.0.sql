
--
-- ALTER: 1.21.0
-- DATE: 2019-07-15
-- FEATURES:
-- ADD new statistic views
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.20.0';
  newVersion text = '1.21.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  CREATE OR REPLACE VIEW stats.org_count_with_guests
  AS select foo.mon, count(distinct foo.organization_id) from
  (
    select uio.organization_id,
        to_char(uio.created_at, 'YYYY-MM') AS mon
    from core.user_in_organization as uio 
    where uio."role" = 'guest'
    group by mon, organization_id
    having count(uio.user_id) >= 1
  ) as foo
    group by foo.mon
  ;

  ALTER VIEW stats.org_count_with_guests OWNER TO heyspace;

  --
  CREATE OR REPLACE VIEW stats.guest_count
  AS select foo.mon, count(distinct foo.id) from
  (
    select to_char(uio.created_at, 'YYYY-MM') AS mon,
      uio.id
    from core.user_in_organization as uio 
    where uio."role" = 'guest'
    group by mon, id
  ) as foo
    group by foo.mon
  ;

  ALTER VIEW stats.guest_count OWNER TO heyspace;

  ALTER TABLE core.user_status ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;

  --
  CREATE OR REPLACE VIEW stats.org_count_user_status
  AS select foo.mon, count(distinct foo.organization_id) from
  (
    select to_char(us.created_at, 'YYYY-MM') AS mon,
      us.organization_id
    from core.user_status as us 
    group by mon, organization_id
  ) as foo
    group by foo.mon
  ;

  ALTER VIEW stats.org_count_user_status OWNER TO heyspace;

  ALTER TABLE extensions.custom_field_value ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;

  CREATE OR REPLACE VIEW stats.org_count_calendar_sync
  AS select foo.mon, count(distinct foo.organization_id) from
  (
    select to_char(cfv.created_at, 'YYYY-MM') AS mon, uio.organization_id
    from extensions.custom_field_value as cfv
	join extensions.custom_field as cf 
	on cfv.field_id = cf.id
	join core.user_in_organization as uio
	on cfv.target_id = uio.id
	join extensions."extension" as e 
	on cf.extension_id = e.id 
	where e."namespace" = 'calendar-sync'
    group by mon, organization_id
  ) as foo
    group by foo.mon
  ; 

  ALTER VIEW stats.org_count_calendar_sync OWNER TO heyspace;

  CREATE OR REPLACE VIEW stats.admin_grants_count
  AS select foo.mon, count(distinct foo.id) from
    (
      select to_char(uio.modified_at, 'YYYY-MM') AS mon,
        uio.id
      from core.user_in_organization as uio 
      where uio."role" = 'admin'
      group by mon, id
    ) as foo
      group by foo.mon
    ;

  ALTER VIEW stats.admin_grants_count OWNER TO heyspace;

  CREATE OR REPLACE VIEW stats.guest_joined_chat_with_me
  as select foo.mon, count(distinct foo.target_id) from
  (
  select to_char(cfv.created_at, 'YYYY-MM') AS mon, cfv.target_id
  from extensions.custom_field_value as cfv
  join extensions.custom_field as cf 
  on cfv.field_id = cf.id 
  join extensions."extension" as e 
  on cf.extension_id = e.id
  where e."namespace" = 'chat-with-me'
    group by mon, target_id
  ) as foo
    group by foo.mon
  ; 

  ALTER VIEW stats.guest_joined_chat_with_me OWNER TO heyspace;


ALTER TABLE extensions.integration ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;

CREATE OR REPLACE VIEW stats.trello_integrations
 as select foo.mon, count(*) from
  (
  select to_char(i.created_at, 'YYYY-MM') AS mon
  from extensions.integration as i
  join extensions."extension" as e 
  on i.extension_id = e.id
  where e."namespace" = 'trello-data-import' and i.status = 'success'
    group by mon
  ) as foo
    group by foo.mon
  ; 

  ALTER VIEW stats.trello_integrations OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.recurrence_settings_count
 as select foo.mon, count(distinct foo.id) from
  (
	  select to_char(trs.created_at, 'YYYY-MM') AS mon, trs.id
	  from "extension-data"."task-recurrence_settings" as trs
    group by mon, id
  ) as foo
    group by foo.mon
  ; 

  ALTER VIEW stats.recurrence_settings_count OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.recurrence_settings_in_organizations
 as select foo.mon, count(distinct foo.organization) from
  (
	  select to_char(trs.created_at, 'YYYY-MM') AS mon, o.id as organization
	  from "extension-data"."task-recurrence_settings" as trs
	  join "project-management".task as t 
	  on trs.task_id = t.id
	  join "project-management".project as p 
	  on t.project_id = p.id
	  join core.organization as o 
	  on p.organization_id = o.id
    group by mon, organization
  ) as foo
    group by foo.mon
  ; 

  ALTER VIEW stats.recurrence_settings_in_organizations OWNER TO heyspace;


  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

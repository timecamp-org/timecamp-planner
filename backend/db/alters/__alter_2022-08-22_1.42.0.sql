
--
-- ALTER: 1.42.0
-- DATE: 2022-08-22
-- FEATURES:
-- group
-- user_in_group
-- task_time_estimate
-- project_attachment

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.41.1';
  newVersion text = '1.42.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE core.group (
    id uuid not null,
    name varchar(100) not null,
    slug varchar(100) not null,
    organization_id uuid NOT NULL 
      CONSTRAINT group_organization_id_fk
      REFERENCES core.organization (id),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone,
    CONSTRAINT group_pkey PRIMARY KEY (id)
  );

  ALTER TABLE core.group OWNER TO heyspace;

  --- FEED group
  DROP TRIGGER IF EXISTS watched_group_table_trigger
  ON core.group;
  CREATE TRIGGER watched_group_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON core.group
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'organization_id');

  CREATE TABLE core.user_in_group (
    user_id uuid NOT NULL 
      CONSTRAINT user_in_group_user_id_fk
      REFERENCES core.user (id),
    group_id uuid NOT NULL 
      CONSTRAINT user_in_group_group_id_fk
      REFERENCES core.group (id),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT user_in_group_pkey PRIMARY KEY (user_id, group_id)
  );

  ALTER TABLE core.user_in_group OWNER TO heyspace;

  --- FEED user_in_group
  DROP TRIGGER IF EXISTS watched_user_in_group_table_trigger
  ON core.user_in_group;
  CREATE TRIGGER watched_user_in_group_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON core.user_in_group
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'group_id');


  CREATE TABLE "messages".project_attachment (
      file_id uuid NOT NULL 
        CONSTRAINT project_attachment_file_id_fk
        REFERENCES "messages".file (id),
      project_id uuid NOT NULL 
        CONSTRAINT project_attachment_project_id_fk
        REFERENCES "project-management".project (id)
  );


  ALTER TABLE "messages".project_attachment OWNER TO heyspace;

  --- file to project
  DROP TRIGGER IF EXISTS watched_project_attachment_table_trigger
  ON "messages".project_attachment;
  CREATE TRIGGER watched_project_attachment_table_trigger
    AFTER INSERT OR DELETE
    ON "messages".project_attachment
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id');


  CREATE TYPE "project-management".sum_period AS ENUM (
      'daily', 'weekly', 'total'
  );

  ALTER TYPE "project-management".sum_period OWNER TO heyspace;

  CREATE TABLE "project-management".task_time_estimate (
    hours INTEGER DEFAULT 0,
    skip_weekends boolean NOT NULL DEFAULT true,
    sum_period "project-management".sum_period NOT NULL,
    task_id uuid NOT NULL 
      CONSTRAINT task_time_estimate_task_id_fk
      REFERENCES "project-management".task (id),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone,
    CONSTRAINT task_time_estimate_pkey PRIMARY KEY (task_id)
  );

  ALTER TABLE "project-management".task_time_estimate OWNER TO heyspace;

    --- task_time_estimate
  DROP TRIGGER IF EXISTS watched_task_time_estimate_table_trigger
  ON "project-management".task_time_estimate;
  CREATE TRIGGER watched_task_time_estimate_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "project-management".task_time_estimate
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

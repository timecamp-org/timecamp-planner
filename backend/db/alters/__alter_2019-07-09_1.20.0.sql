
--
-- ALTER: 1.19.0
-- DATE: 2019-07-04
-- FEATURES:
-- * add recurring tasks extension
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.19.0';
  newVersion text = '1.20.0';
  recurrence_extension_id uuid = uuid_generate_v4();
  recurrence_settings_relation_id uuid = uuid_generate_v4();
  recurrence_dependency_relation_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)

  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url, type)
   VALUES (recurrence_extension_id, 'task-recurrence', 'Recurring cards', 'Now make your cards recurrent with fully customized settings', 'https://tocpjptk01.execute-api.eu-central-1.amazonaws.com/dev/resize?key=360x360_b/d186ff84a086ef5ecd2b910c64e9bfbdcdc7775e6552f1deb68638fe3d64358b', 'internal');
  --

  INSERT INTO extensions.custom_field(extension_id, name, target_type)
  VALUES
         (recurrence_extension_id, 'recurringTasksEnabled', 'project'),
         (recurrence_extension_id, 'enabledStatus', 'organization')
  ;
  
  -- Hard code custom relation definition for recurring tasks
  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (recurrence_settings_relation_id, recurrence_extension_id, 'settings'),
         (recurrence_dependency_relation_id, recurrence_extension_id, 'dependency')
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (recurrence_settings_relation_id, 'id', null, true),
         (recurrence_settings_relation_id, 'task_id', 'project-management.task', false),
         (recurrence_settings_relation_id, 'value', null, false),
         (recurrence_settings_relation_id, 'next_recurrence_at', null, false)
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (recurrence_dependency_relation_id, 'id', null, true),
         (recurrence_dependency_relation_id, 'task_id', 'project-management.task', false),
         (recurrence_dependency_relation_id, 'target_task_id', 'project-management.task', false),
         (recurrence_dependency_relation_id, 'recurrency_settings_id', 'extension-data.task-recurrence_settings', true)
  ;

    -- table name in format <namespace>_<some-relation-name>
  CREATE TABLE "extension-data"."task-recurrence_settings" (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT "task-recurrence_settings_pk" PRIMARY KEY,
    task_id UUID NOT NULL
      CONSTRAINT "recurrence_settings_task_id_fk" REFERENCES "project-management".task(id),
     "value" jsonb NOT NULL,
     next_recurrence_at TIMESTAMP WITH TIME ZONE NOT NULL,
     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "extension-data_task-recurrence_settings_task_id_uniq" UNIQUE (task_id)
  );

  ALTER TABLE "extension-data"."task-recurrence_settings" OWNER TO heyspace;

  
    -- table name in format <namespace>_<some-relation-name>
  CREATE TABLE "extension-data"."task-recurrence_dependency" (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT "task-recurrence_dependency_pk" PRIMARY KEY,
    task_id UUID NOT NULL
      CONSTRAINT "recurrence_dependency_task_id_fk" REFERENCES "project-management".task(id),
    target_task_id UUID NOT NULL
      CONSTRAINT "recurrence_dependency_target_task_id_fk" REFERENCES "project-management".task(id),
    recurrency_settings_id UUID NOT NULL
      CONSTRAINT "recurrence_dependency_recurrency_settings_id_fk" 
      REFERENCES "extension-data"."task-recurrence_settings"(id)
      ON DELETE CASCADE,
    CONSTRAINT "recurrence_dependency_task_id_recurrency_id_uniq" UNIQUE (task_id, target_task_id, recurrency_settings_id)
  );

  ALTER TABLE "extension-data"."task-recurrence_dependency" OWNER TO heyspace;


    --- FEED task-recurrence_settings
  DROP TRIGGER IF EXISTS watch_task_recurrence_settings_table_trigger
  ON "extension-data"."task-recurrence_settings";
  CREATE TRIGGER watch_task_recurrence_settings_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "extension-data"."task-recurrence_settings"
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'task_id');


    --- FEED task-recurrence_dependency
  DROP TRIGGER IF EXISTS watch_task_recurrence_dependency_table_trigger
  ON "extension-data"."task-recurrence_dependency";
  CREATE TRIGGER watch_task_recurrence_dependency_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "extension-data"."task-recurrence_dependency"
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'task_id', 'target_task_id');


--- Task
DROP TRIGGER IF EXISTS watched_task_table_trigger
ON "project-management".task;
CREATE TRIGGER watched_task_table_trigger
  AFTER INSERT OR DELETE OR UPDATE
  ON "project-management".task
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

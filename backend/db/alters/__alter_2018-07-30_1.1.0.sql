
--
-- ALTER: 1.1.0
-- DATE: 2018-07-30
-- FEATURES: 
-- * skeleton data structures for extensions and custom fields
--


\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.0.9';
  newVersion text = '1.1.0';
  voting_extension_id uuid = uuid_generate_v4();
  agile_extension_id uuid = uuid_generate_v4();
  voting_relation_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  CREATE SCHEMA IF NOT EXISTS "extensions";
  ALTER SCHEMA "extensions" OWNER TO heyspace;
  
  CREATE SCHEMA IF NOT EXISTS "extension-data";
  ALTER SCHEMA "extension-data" OWNER TO heyspace;

  CREATE TYPE "extensions".custom_field_target AS ENUM('organization', 'project', 'task', 'task-list');

  ALTER TYPE extensions.custom_field_target OWNER TO heyspace;

  -- Extension list
  CREATE TABLE extensions.extension (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT extension_id_pk PRIMARY KEY,
      namespace VARCHAR(50) NOT NULL CONSTRAINT extension_namespace_uniq UNIQUE,
      name VARCHAR(200) NOT NULL,
      description text,
      thumbnail_url character varying(8000)
  );

  ALTER TABLE extensions.extension OWNER TO heyspace;


  CREATE TABLE extensions.extension_in_organization
  (
      extension_id uuid NOT NULL 
        CONSTRAINT extension_in_organization_extension_id_fk 
        REFERENCES extensions.extension (id),
      organization_id uuid NOT NULL 
        CONSTRAINT extension_in_organization_organization_id_fk
        REFERENCES core.organization (id),
      status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL,
      CONSTRAINT extension_in_organization_extension_id_organization_id_pk PRIMARY KEY (extension_id, organization_id)
  );

  ALTER TABLE extensions.extension_in_organization OWNER to heyspace;

  -- Custom fields defined by extensions
  CREATE TABLE extensions.custom_field (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT extension_custom_field_pk PRIMARY KEY,
    extension_id UUID NOT NULL
      CONSTRAINT extension_custom_field_extension_id_fk
      REFERENCES extensions.extension("id"),
    name VARCHAR(50) NOT NULL,

    target_type extensions.custom_field_target NOT NULL,

    CONSTRAINT extension_custom_field_extension_id_uniq
    UNIQUE (extension_id, target_type, name)
  );

  ALTER TABLE extensions.custom_field OWNER TO heyspace;

  -- Saved custom field values
  CREATE TABLE extensions.custom_field_value (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL
    CONSTRAINT extension_custom_field_value_field_fk
    REFERENCES extensions.custom_field(id),

    "value" JSONB,

    target_type extensions.custom_field_target NOT NULL,
    target_id UUID NOT NULL,

    CONSTRAINT extension_custom_field_value_pk 
      PRIMARY KEY (target_type, target_id, field_id)
  );
  ALTER TABLE extensions.custom_field_value OWNER TO heyspace;

  -- Custom relations defined by extensions
  CREATE TABLE extensions.custom_relation (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT extension_custom_relation_pk PRIMARY KEY,
    extension_id UUID NOT NULL
      CONSTRAINT extension_custom_relation_extension_id_fk
      REFERENCES extensions.extension("id"),
    name VARCHAR(50) NOT NULL,
    
    CONSTRAINT extensions_custom_relation_extension_id_name_unique
      UNIQUE (extension_id, name)
  );
  ALTER TABLE extensions.custom_relation OWNER TO heyspace;
  
  -- Relation's columns (mainly for validation purposes)
  -- Proposition: custom relations MUST have primary key defined AND this is the only kind of key allowed.
  CREATE TABLE extensions.custom_relation_field (
    relation_id UUID NOT NULL
      CONSTRAINT extension_custom_relation_field_relation_id_fk
      REFERENCES extensions.custom_relation(id),
    name varchar(50) NOT NULL,
    -- Reference field is always 'id' for now.
    reference_table VARCHAR(100) NULL,
    is_pk BOOLEAN NOT NULL,
    
    CONSTRAINT extension_custom_relation_field_relation_id_name_unique
      UNIQUE (relation_id, name)
  );
  ALTER TABLE extensions.custom_relation_field OWNER TO heyspace;

  
  
  -- Hard coded virgin extensions: 'Agile' and 'Task Voting'
  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url)
  VALUES (agile_extension_id, 'agile', 'Estimates', 'Estimate tasks as a story points, man-days or another metric.', 'https://tocpjptk01.execute-api.eu-central-1.amazonaws.com/dev/resize?key=360x360_b/60c20f969a1fab215f73a7392e30b2324db1133e8bcd22532097d2c526bd0c13'),
         (voting_extension_id, 'task-voting', 'Votes', 'Add this module to vote for cards.', 'https://tocpjptk01.execute-api.eu-central-1.amazonaws.com/dev/resize?key=360x360_b/3de807f612e1db377254278cc097c15a7c5f622dee629f92b7c9681ac0d774a8');

  INSERT INTO extensions.custom_field(extension_id, name, target_type)
  VALUES
         (agile_extension_id, 'estimatedEffort', 'task'),
         (agile_extension_id, 'estimatesEnabled', 'project'),
         (voting_extension_id, 'votingEnabled', 'project'),
         (agile_extension_id, 'enabledStatus', 'organization'),
         (voting_extension_id, 'enabledStatus', 'organization')
  ;
  
  -- Hard code custom relation definition for task voting
  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (voting_relation_id, voting_extension_id, 'reaction')
  ;
  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (voting_relation_id, 'task_id', 'project-management.task', true),
         (voting_relation_id, 'user_id', 'core.user', true),
         (voting_relation_id, 'emoji_code', null, true)
  ;
  
  -- table name in format <namespace>_<some-relation-name>
  CREATE TABLE "extension-data"."task-voting_reaction" (
    task_id UUID NOT NULL
      CONSTRAINT "extension-data_task-voting_reaction_task_id_fk" REFERENCES "project-management".task(id),
    user_id UUID NOT NULL
      CONSTRAINT "extension-data_task-voting_reaction_user_id_fk" REFERENCES "core".user(id),
    emoji_code VARCHAR(50) NOT NULL,
    
    CONSTRAINT "extension-data_task-voting_emoji_code_task_id_user_id_pk"
      PRIMARY KEY (task_id, user_id, emoji_code)
  );
  ALTER TABLE "extension-data"."task-voting_reaction" OWNER TO heyspace;

  --- additional column to notify_trigger
  CREATE OR REPLACE FUNCTION watchers.notify_trigger()
    RETURNS TRIGGER AS $inner$
  DECLARE
    id_column     VARCHAR;
    notification  JSON;
    id            VARCHAR;
    record_to_use RECORD;
  BEGIN

    IF TG_OP = 'DELETE'
    THEN
      record_to_use = OLD;
    ELSE
      record_to_use = NEW;
    END IF;

    -- First argument is id column name
    IF TG_NARGS < 1 THEN
      EXECUTE 'SELECT $1.id'
      INTO id
      USING record_to_use;
    ELSIF TG_NARGS = 1 THEN
      -- Selects value from column given by one param`
      EXECUTE 'SELECT $1.' || TG_ARGV[0]
      INTO id
      USING record_to_use;
    ELSIF TG_NARGS = 2 THEN
      -- Selects value from column given by one param`
      EXECUTE 'SELECT ($1.' || TG_ARGV[0] || ', $1.' || TG_ARGV[1] || ')'
      INTO id
      USING record_to_use;
    ELSIF TG_NARGS = 3 THEN
      -- Selects value from column given by one param`
      EXECUTE 'SELECT ($1.' || TG_ARGV[0] || ', $1.' || TG_ARGV[1] || ', $1.' || TG_ARGV[2] || ')'
      INTO id
      USING record_to_use;
    END IF;

    notification = json_build_object(
        'table', TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
        'action', TG_OP,
        'id', id);
    PERFORM pg_notify('notify', notification :: TEXT);
    RETURN new;
  END;
  $inner$ LANGUAGE plpgsql;

  --- FEED extension in organization
  DROP TRIGGER IF EXISTS watched_extension_in_organization_table_trigger
  ON extensions.extension_in_organization;
  CREATE TRIGGER watched_extension_in_organization_table_trigger
    AFTER INSERT OR UPDATE
    ON extensions.extension_in_organization
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('extension_id', 'organization_id');

  --- FEED custom field value
  DROP TRIGGER IF EXISTS watched_custom_field_value_table_trigger
  ON extensions.custom_field_value;
  CREATE TRIGGER watched_custom_field_value_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON extensions.custom_field_value
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');

  --- FEED task-voting_reaction
  DROP TRIGGER IF EXISTS watched_task_voting_reaction_table_trigger
  ON "extension-data"."task-voting_reaction";
  CREATE TRIGGER watched_task_voting_reaction_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "extension-data"."task-voting_reaction"
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id', 'user_id', 'emoji_code');
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

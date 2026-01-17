
--
-- ALTER: 1.11.0
-- DATE: 2019-05-09
-- FEATURES:
-- * update calendar integration thumbnail
-- * add extension categories
-- * create table to store oauth1 tokens
-- * add trello data import integration
-- * add integration progress
-- * add trello integration data
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.10.0';
  newVersion text = '1.11.0';
  trello_extension_id uuid = uuid_generate_v4();
  trello_task_relation_id uuid = uuid_generate_v4();
  trello_task_list_relation_id uuid = uuid_generate_v4();
  trello_project_relation_id uuid = uuid_generate_v4();
  trello_oauth1_client_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  UPDATE extensions.extension
  SET thumbnail_url = 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/a2bf88a21468db55f34c54a2aeb0c948c5da03fb720b4ebc0f509146713c56ec'
  WHERE namespace = 'calendar-sync';



  CREATE TYPE extensions.extension_type AS ENUM (
    'integration',
    'internal'
  );

  ALTER TABLE extensions.extension ADD COLUMN type extensions.extension_type DEFAULT 'internal' NOT NULL;

  UPDATE extensions.extension
  SET type = 'integration'
  WHERE namespace = 'calendar-sync';



  CREATE TABLE auth.oauth1_client (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT oauth1_client_pk PRIMARY KEY,
    application_name text NOT NULL,

    CONSTRAINT "oauth1_client_application_name"
      UNIQUE (application_name)
  );

  ALTER TABLE auth.oauth1_client OWNER TO heyspace;

  INSERT INTO auth.oauth1_client(id, application_name)
  VALUES (trello_oauth1_client_id, 'trello');



  CREATE TABLE auth.oauth1_request_token (
    user_id uuid NOT NULL
      CONSTRAINT fk_oauth1_request_token_user_id
      REFERENCES core."user"(id)
      ON DELETE CASCADE,
    organization_id uuid NOT NULL
      CONSTRAINT fk_oauth1_request_token_organization_id
      REFERENCES core."organization"(id)
      ON DELETE CASCADE,
    client_id uuid NOT NULL
      CONSTRAINT fk_oauth1_request_token_oauth1_client_id
      REFERENCES auth.oauth1_client(id)
      ON DELETE CASCADE,
    token text NOT NULL,
    secret text NOT NULL
  );

  ALTER TABLE auth.oauth1_request_token OWNER TO heyspace;

  ALTER TABLE auth.oauth1_request_token
      ADD CONSTRAINT oauth1_request_token_for_integration UNIQUE (organization_id, user_id, client_id) DEFERRABLE INITIALLY IMMEDIATE;



  CREATE TABLE auth.oauth1_access_token (
    user_id uuid NOT NULL
      CONSTRAINT fk_oauth1_access_token_user_id
      REFERENCES core."user"(id)
      ON DELETE CASCADE,
    organization_id uuid NOT NULL
      CONSTRAINT fk_oauth1_access_token_organization_id
      REFERENCES core."organization"(id)
      ON DELETE CASCADE,
    client_id uuid NOT NULL
      CONSTRAINT fk_oauth1_access_token_oauth1_client_id
      REFERENCES auth.oauth1_client(id)
      ON DELETE CASCADE,
    token text NOT NULL,
    secret text NOT NULL
  );

  ALTER TABLE auth.oauth1_access_token OWNER TO heyspace;

  ALTER TABLE auth.oauth1_access_token
      ADD CONSTRAINT oauth1_access_token_for_integration UNIQUE (organization_id, user_id, client_id) DEFERRABLE INITIALLY IMMEDIATE;



  CREATE TABLE auth.oauth1_api_key (
    user_id uuid NOT NULL
      CONSTRAINT fk_oauth1_api_key_user_id
      REFERENCES core."user"(id)
      ON DELETE CASCADE,
    organization_id uuid NOT NULL
      CONSTRAINT fk_oauth1_api_key_organization_id
      REFERENCES core."organization"(id)
      ON DELETE CASCADE,
    client_id uuid NOT NULL
      CONSTRAINT fk_oauth1_api_key_oauth1_client_id
      REFERENCES auth.oauth1_client(id)
      ON DELETE CASCADE,
    api_key text NOT NULL,
    secret text NOT NULL
  );

  ALTER TABLE auth.oauth1_api_key OWNER TO heyspace;

  ALTER TABLE auth.oauth1_api_key
    ADD CONSTRAINT oauth1_api_key_for_integration UNIQUE (organization_id, user_id, client_id) DEFERRABLE INITIALLY IMMEDIATE;


  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url, type)
  VALUES (trello_extension_id, 'trello-data-import', 'Trello Integration', 'Import all Trello boards to HeySpace.', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/fbd62dae9049c4ed6e873f08e0021ddc8cb209a1cc81d0f60c553e5f1cb9d576', 'integration');
 

  CREATE TYPE extensions.integration_status AS ENUM (
    'inProgress',
    'success',
    'failure'
  );

  CREATE TABLE extensions.integration (
    user_id uuid NOT NULL
      CONSTRAINT fk_integration_user_id
      REFERENCES core."user"(id)
      ON DELETE CASCADE,
    organization_id uuid NOT NULL
      CONSTRAINT fk_integration_organization_id
      REFERENCES core."organization"(id)
      ON DELETE CASCADE,
    extension_id uuid NOT NULL
      CONSTRAINT fk_integration_extension_id
      REFERENCES extensions.extension(id)
      ON DELETE CASCADE,
    status extensions.integration_status NOT NULL,
    user_confirmed_status boolean NOT NULL
  );

  ALTER TABLE extensions.integration OWNER TO heyspace;

  ALTER TABLE extensions.integration
    ADD CONSTRAINT integration_for_organization_and_user UNIQUE (organization_id, user_id, extension_id) DEFERRABLE INITIALLY IMMEDIATE;

  DROP TRIGGER IF EXISTS watch_integration
    ON extensions.integration;
    CREATE TRIGGER watch_integration
    AFTER INSERT OR UPDATE
    ON extensions.integration
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'organization_id', 'extension_id');



  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (trello_task_relation_id, trello_extension_id, 'external_task_id')
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (trello_task_relation_id, 'task_id', 'project-management.task', true),
         (trello_task_relation_id, 'organization_id', 'core.organization', true),
         (trello_task_relation_id, 'external_task_id', null, true)
  ;
  
  CREATE TABLE "extension-data"."trello-data-import_external_task_id" (
    task_id UUID NOT NULL
      CONSTRAINT "external_task_task_fk" REFERENCES "project-management".task(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    organization_id UUID NOT NULL
      CONSTRAINT "external_task_organization_fk" REFERENCES "core".organization(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    external_task_id text NOT NULL,
    
    CONSTRAINT "external_task_external_task_organization_pk"
      UNIQUE (organization_id, external_task_id),

    CONSTRAINT "external_task_task_organization_pk"
      UNIQUE (organization_id, task_id),

    CONSTRAINT "external_task_external_task_task_organization_pk"
      UNIQUE (organization_id, task_id, external_task_id)
  );
  ALTER TABLE "extension-data"."trello-data-import_external_task_id" OWNER TO heyspace;




  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (trello_task_list_relation_id, trello_extension_id, 'external_task_list_id')
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (trello_task_list_relation_id, 'task_list_id', 'project-management.task_list', true),
         (trello_task_list_relation_id, 'organization_id', 'core.organization', true),
         (trello_task_list_relation_id, 'external_task_list_id', null, true)
  ;
  
  CREATE TABLE "extension-data"."trello-data-import_external_task_list_id" (
    task_list_id UUID NOT NULL
      CONSTRAINT "external_task_list_task_list_fk" REFERENCES "project-management".task_list(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    organization_id UUID NOT NULL
      CONSTRAINT "external_task_list_organization_fk" REFERENCES "core".organization(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    external_task_list_id text NOT NULL,
    
    CONSTRAINT "external_task_list_external_task_list_organization_pk"
      UNIQUE (organization_id, external_task_list_id),

    CONSTRAINT "external_task_list_task_list_organization_pk"
      UNIQUE (organization_id, task_list_id),

    CONSTRAINT "external_task_list_external_task_list_task_list_organization_pk"
      UNIQUE (organization_id, task_list_id, external_task_list_id)
  );
  ALTER TABLE "extension-data"."trello-data-import_external_task_list_id" OWNER TO heyspace;

  
  
  
  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (trello_project_relation_id, trello_extension_id, 'external_project_id')
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (trello_project_relation_id, 'project_id', 'project-management.project', true),
         (trello_project_relation_id, 'organization_id', 'core.organization', true),
         (trello_project_relation_id, 'external_project_id', null, true)
  ;
  
  CREATE TABLE "extension-data"."trello-data-import_external_project_id" (
    project_id UUID NOT NULL
      CONSTRAINT "external_project_project_fk" REFERENCES "project-management".project(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    organization_id UUID NOT NULL
      CONSTRAINT "external_project_organization_fk" REFERENCES "core".organization(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,
    external_project_id text NOT NULL,
    
    CONSTRAINT "external_project_external_project_organization_pk"
      UNIQUE (organization_id, external_project_id),

    CONSTRAINT "external_project_project_organization_pk"
      UNIQUE (organization_id, project_id),

    CONSTRAINT "external_project_external_project_project_organization_pk"
      UNIQUE (organization_id, project_id, external_project_id)
  );
  ALTER TABLE "extension-data"."trello-data-import_external_project_id" OWNER TO heyspace;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

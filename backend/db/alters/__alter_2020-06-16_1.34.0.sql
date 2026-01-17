
--
-- ALTER: 1.34.0
-- DATE: 2020-06-16
-- FEATURES:
-- * Add user_project_group table
-- * Add project_in_group table
-- * Add Personal Project Structure extension
-- * Reference user_project_group in user_project_order table
-- * Add organization_id column and change Order column data type in user_project_order table

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.33.0';
  newVersion text = '1.34.0';
  new_extension_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE "project-management".user_project_group (
    id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT user_project_group_pk PRIMARY KEY,
    user_in_organization_id UUID NOT NULL CONSTRAINT user_project_group_user_in_organization_id_fk REFERENCES core.user_in_organization(id),
    name VARCHAR(100),
    "order" int NOT NULL,
    "is_expanded" BOOLEAN NOT NULL DEFAULT FALSE
  );

  ALTER TABLE "project-management".user_project_group OWNER TO heyspace;

  CREATE TABLE "project-management".project_in_group (
    id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT project_in_group_id_pk PRIMARY KEY,
    project_id UUID NOT NULL CONSTRAINT project_in_group_project_id_fk REFERENCES "project-management".project(id) ON DELETE CASCADE,
    group_id UUID NOT NULL CONSTRAINT project_in_group_group_id_fk REFERENCES "project-management".user_project_group(id) ON DELETE CASCADE,
    user_id UUID NOT NULL CONSTRAINT project_in_group_user_id_fk REFERENCES "core".user(id) ON DELETE CASCADE,
    "order" int DEFAULT NULL
  );

  ALTER TABLE "project-management".project_in_group OWNER TO heyspace;

  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url, type, is_in_marketplace)
    VALUES (new_extension_id, 'project-groups-and-order', 'Personal project structure', '', '', 'internal', false);

  ALTER TABLE "project-management".user_project_order DROP CONSTRAINT user_project_order_user_id_project_id_pk;
  ALTER TABLE "project-management".user_project_order ADD id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT user_project_order_id_pk PRIMARY KEY;
  ALTER TABLE "project-management".user_project_order ALTER COLUMN "order" TYPE int;
  ALTER TABLE "project-management".user_project_order ALTER COLUMN "order" DROP DEFAULT;
  ALTER TABLE "project-management".user_project_order DROP COLUMN user_id;
  ALTER TABLE "project-management".user_project_order ADD user_in_organization_id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT user_project_order_user_in_organization_id_fk REFERENCES core.user_in_organization(id);
  ALTER TABLE "project-management".user_project_order ALTER COLUMN user_in_organization_id DROP DEFAULT;

  DROP TRIGGER IF EXISTS watched_user_project_group_table_trigger
  ON "project-management".user_project_group;
  CREATE TRIGGER watched_user_project_group_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".user_project_group
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'user_in_organization_id');

  DROP TRIGGER IF EXISTS watched_project_in_group_table_trigger
  ON "project-management".project_in_group;
  CREATE TRIGGER watched_project_in_group_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".project_in_group
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'group_id', 'project_id');

  DROP TRIGGER IF EXISTS watched_user_project_order_table_trigger
  ON "project-management".user_project_order;
  CREATE TRIGGER watched_user_project_order_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".user_project_order
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'user_in_organization_id', 'project_id');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

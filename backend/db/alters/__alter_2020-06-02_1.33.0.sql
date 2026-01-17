
--
-- ALTER: 1.33.0
-- DATE: 2020-06-02
-- FEATURES:
-- Add guest seats table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.32.0';
  newVersion text = '1.33.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "project-management".user_in_project drop constraint user_in_project_user_id_project_id_pk;
  ALTER TABLE "project-management".user_in_project add column id UUID PRIMARY KEY NOT NULL default uuid_generate_v4();
  ALTER TABLE "project-management".user_in_project add constraint user_in_project_user_id_project_id_uniq UNIQUE (user_id, project_id);

  CREATE TABLE "project-management".guest_in_project (
    id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT guest_in_project_pk PRIMARY KEY,
    user_in_organization_id UUID NOT NULL,
    user_in_project_id UUID NOT NULL,
    organization_id UUID NOT NULL,

    CONSTRAINT user_in_organization_id_fk FOREIGN KEY (user_in_organization_id) REFERENCES core.user_in_organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_in_project_id_fk FOREIGN KEY (user_in_project_id) REFERENCES "project-management".user_in_project(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT organization_id_fk FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_in_organization_id_user_in_project_id_uniq UNIQUE (user_in_organization_id, user_in_project_id)
  );

  ALTER TABLE "project-management".guest_in_project OWNER TO heyspace;

  insert into "project-management".guest_in_project (user_in_organization_id, user_in_project_id, organization_id)
  select uio.id, uip.id, uio.organization_id from "project-management".user_in_project as uip 
  join core.user_in_organization as uio on uip.user_id = uio.user_id 
  join "project-management".project as p on uip.project_id = p.id and p.organization_id = uio.organization_id
  join core."user" as u on uip.user_id = u.id
  where uio.entity_status = 'exists'
  and u.status = 'exists'
  and p.project_type = 'project'
  and p.is_archived = false
  and uio."role" = 'guest';

  --- guest_in_project
  DROP TRIGGER IF EXISTS watched_guest_in_project_table_trigger
  ON "project-management".guest_in_project;
  CREATE TRIGGER watched_guest_in_project_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".guest_in_project
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'organization_id');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

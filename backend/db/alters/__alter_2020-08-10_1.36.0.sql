
--
-- ALTER: 1.36.0
-- DATE: 2020-08-10
-- FEATURES:
-- Add project_latest_visit table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.35.3';
  newVersion text = '1.36.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE "project-management".project_latest_visit (
    id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT project_latest_visit_pk PRIMARY KEY,
    project_id UUID NOT NULL CONSTRAINT project_latest_visit_project_id_fk REFERENCES "project-management".project(id),
    user_id UUID NOT NULL CONSTRAINT project_latest_visit_user_id_fk REFERENCES core.user(id),
    organization_id UUID NOT NULL CONSTRAINT project_latest_visit_organization_id_fk REFERENCES core.organization(id),
    user_in_project_id UUID NOT NULL CONSTRAINT project_latest_visit_user_in_project_id_fk REFERENCES "project-management".user_in_project(id)
      ON DELETE CASCADE,
    CONSTRAINT "project_latest_visit_uniq" UNIQUE (user_id, organization_id)
  );

  ALTER TABLE "project-management".project_latest_visit OWNER TO heyspace;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

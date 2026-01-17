
--
-- ALTER: 1.35.1
-- DATE: 2020-07-14
-- FEATURES:
-- Add unique constraints to project_in_group, user_project_group, user_project_order tables
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.35.0';
  newVersion text = '1.35.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "project-management".user_project_order
    ADD CONSTRAINT "user_project_order_uniq" UNIQUE (project_id, user_in_organization_id);

  ALTER TABLE "project-management".user_project_group
    ADD CONSTRAINT "user_project_group_uniq" UNIQUE (id, user_in_organization_id);

  ALTER TABLE "project-management".project_in_group
    ADD CONSTRAINT "project_in_group_uniq" UNIQUE (user_id, project_id);

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

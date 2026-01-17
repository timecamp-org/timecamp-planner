
--
-- ALTER: 1.22.1
-- DATE: 2019-08-05
-- FEATURES:
-- Add user_id to projectPeople trigger
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.22.0';
  newVersion text = '1.22.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  DROP TRIGGER IF EXISTS watched_user_in_project_table_trigger
  ON "project-management".user_in_project;
  CREATE TRIGGER watched_user_in_project_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "project-management".user_in_project
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id', 'user_id');

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

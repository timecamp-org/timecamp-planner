  --
  -- ALTER: 1.1.7
  -- DATE: 30.08.2018
  -- FEATURES:
  -- * Add update tag trigger
  --


\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.1.6';
DECLARE newVersion text = '1.1.7';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

DROP TRIGGER IF EXISTS watched_tag_table_trigger
ON "project-management".tag;
CREATE TRIGGER watched_tag_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".tag
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'organization_id');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

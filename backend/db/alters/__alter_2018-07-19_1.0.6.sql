  --
  -- ALTER: 1.0.6
  -- DATE: 19.07.2018
  -- FEATURES: 
  -- * add trigger to organization table
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.5';
DECLARE newVersion text = '1.0.6';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

--- Organization
DROP TRIGGER IF EXISTS watched_organization_table_trigger
ON core.organization;
CREATE TRIGGER watched_organization_table_trigger
  AFTER UPDATE
  ON core.organization
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

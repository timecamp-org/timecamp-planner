
--
-- ALTER: 1.2.1
-- DATE: 2018-12-04
-- FEATURES:
-- * Add entity status column to user in organization table
-- * Add on update trigger to user in organization watcher
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.2.0';
  newVersion text = '1.2.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user_in_organization ADD COLUMN entity_status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL;

  DROP TRIGGER IF EXISTS watched_user_in_organization_table_trigger
  ON core.user_in_organization;
  CREATE TRIGGER watched_user_in_organization_table_trigger
    AFTER INSERT OR DELETE OR UPDATE
    ON core.user_in_organization
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'organization_id');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

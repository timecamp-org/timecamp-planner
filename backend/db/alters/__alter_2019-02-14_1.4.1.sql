
--
-- ALTER: 1.4.1
-- DATE: 2019-02-14
-- FEATURES:
-- * Add deviceType to user session row
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.4.0';
  newVersion text = '1.4.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user_session ADD COLUMN device_type notifications.device_type;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;


--
-- ALTER: 1.9.0
-- DATE: 2019-04-24
-- FEATURES:
-- *  add start_date column to tasks
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.8.0';
  newVersion text = '1.9.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
 
    ALTER TABLE "project-management".task
    ADD COLUMN start_date timestamp with time zone;

  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

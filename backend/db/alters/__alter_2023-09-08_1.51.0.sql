  --
  -- ALTER: 1.51.0
  -- DATE: 08.09.2023
  -- FEATURES: 
  -- add pg_trgm extension
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.50.0';
  newVersion text = '1.51.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping pg_trgm extension (insufficient privilege)';
END;
  

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
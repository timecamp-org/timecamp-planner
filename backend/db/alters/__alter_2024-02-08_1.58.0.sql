  --
  -- ALTER: 1.58.0
  -- DATE: 12.02.2024
  -- FEATURES: 
  -- add referrer field to user model
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.57.0';
  newVersion text = '1.58.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user ADD COLUMN IF NOT EXISTS referrer text;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
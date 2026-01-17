  --
  -- ALTER: 0.0.1
  -- DATE: 05.07.2018
  -- FEATURES: 
  -- * fixed sth 1
  -- * added sth 2
  -- * optimized sth 3
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '0.0.1';
DECLARE newVersion text = '0.0.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

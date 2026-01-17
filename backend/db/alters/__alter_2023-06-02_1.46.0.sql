  --
  -- ALTER: 1.46.0
  -- DATE: 02.06.2023
  -- FEATURES: 
  -- replace Estimate with Points
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.45.0';
  newVersion text = '1.46.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


UPDATE extensions.extension SET name='Points' where namespace='agile';


  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
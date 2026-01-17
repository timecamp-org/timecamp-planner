  --
  -- ALTER: 1.57.0
  -- DATE: 02.01.2024
  -- FEATURES: 
  -- add index on message table for content column
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.56.0';
  newVersion text = '1.57.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

CREATE INDEX idx_content_trgm ON messages.message USING gin(content gin_trgm_ops);
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
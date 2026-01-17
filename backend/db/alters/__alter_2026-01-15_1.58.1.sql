  --
  -- ALTER: 1.58.1
  -- DATE: 2026-01-15
  -- FEATURES:
  -- add missing ip_address column to user table
  --

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.58.0';
  newVersion text = '1.58.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core."user" ADD COLUMN IF NOT EXISTS ip_address INET DEFAULT NULL;

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

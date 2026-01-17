
--
-- ALTER: 1.39.0
-- DATE: 2021-11-12
-- FEATURES:
-- add ip_address field to the user
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.38.4';
  newVersion text = '1.39.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

 --
  -- START ALTER (insert statements below)
  --

ALTER TABLE "core"."user" ADD COLUMN IF NOT EXISTS "ip_address" INET DEFAULT NULL;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;


--
-- ALTER: 1.23.0
-- DATE: 2019-08-23
-- FEATURES:
-- Add entity_history to checklist item
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.22.2';
  newVersion text = '1.23.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "project-management".checklist_item ADD entity_history jsonb;

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

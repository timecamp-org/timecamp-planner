
--
-- ALTER: 1.1.14
-- DATE: 2018-11-30
-- FEATURES:
-- * Add isLinkPreviewEnabled column to message
--


\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.1.13';
  newVersion text = '1.1.14';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "messages".message ADD COLUMN is_link_preview_enabled BOOLEAN DEFAULT true NOT NULL;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

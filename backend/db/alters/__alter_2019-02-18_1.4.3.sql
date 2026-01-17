
--
-- ALTER: 1.4.3
-- DATE: 2019-02-18
-- FEATURES:
-- * Add locale field to user
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.4.2';
  newVersion text = '1.4.3';
  calendar_extension_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user
    ADD COLUMN IF NOT EXISTS locale character varying(5) not null default 'en';

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;


--
-- ALTER: 1.30.1
-- DATE: 2020-04-08
-- FEATURES:
-- Add timestamps to view_settings
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.30.0';
  newVersion text = '1.30.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


  alter table settings.view_settings add column created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT null;
  alter table settings.view_settings add column updated_at timestamp with time zone;

  alter table settings.linked_view_settings add column created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT null;


  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;


--
-- ALTER: 1.36.2
-- DATE: 2020-08-24
-- FEATURES:
-- Remove redundant column
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.36.1';
  newVersion text = '1.36.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  insert into dictionaries.notification_center_type (value, label) VALUES
    ('ALL', 'All');

  alter table core.user drop column notifications_displayed_at;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

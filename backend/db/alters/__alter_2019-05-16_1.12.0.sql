
--
-- ALTER: 1.12.0
-- DATE: 2019-05-16
-- FEATURES:
-- * add invitations count
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.11.0';
  newVersion text = '1.12.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user_invitation add column invitation_count int not null default 1;

  ALTER TABLE core.user_invitation add column updated_at timestamp with time zone;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;


--
-- ALTER: 1.2.2
-- DATE: 2019-01-09
-- FEATURES:
-- * Add created_at, resent_at, resent_count to user_invitation table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.2.1';
  newVersion text = '1.2.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user_invitation ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;
  ALTER TABLE core.user_invitation ADD COLUMN resent_at timestamp with time zone;
  ALTER TABLE core.user_invitation ADD COLUMN resent_count int not null default 0;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

--
-- ALTER: 1.0.1
-- DATE: 2018-07-10
-- FEATURES: 
-- * added column to user_session to inform if finished session made user go offline.
--


\set ON_ERROR_STOP on

DO $$
  DECLARE previousVersion text = '1.0.0';
  DECLARE newVersion text = '1.0.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  ALTER TABLE core.user_session ADD went_offline BOOLEAN DEFAULT false NOT NULL;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

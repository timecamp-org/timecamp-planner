
  --
  -- ALTER: 1.0.4
  -- DATE: 16.07.2018
  -- FEATURES: 
  -- * renamed colon to emojiCode in message_reaction
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.3';
DECLARE newVersion text = '1.0.4';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "messages".message_reaction RENAME COLUMN colon TO emoji_code;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

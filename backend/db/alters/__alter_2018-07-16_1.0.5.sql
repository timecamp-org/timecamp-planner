  --
  -- ALTER: 1.0.5
  -- DATE: 16.07.2018
  -- FEATURES: 
  -- * removed message_id foreign key from message_read table
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.4';
DECLARE newVersion text = '1.0.5';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "messages".task_message_read DROP CONSTRAINT task_message_read_message_id_fk;
  ALTER TABLE "messages".project_message_read DROP CONSTRAINT project_message_read_message_id_fk;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

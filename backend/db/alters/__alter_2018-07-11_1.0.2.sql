
  --
  -- ALTER: 1.0.2
  -- DATE: 11.07.2018
  -- FEATURES: 
  -- * added message_id column in task_message_read and project_message_read tables
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.1';
DECLARE newVersion text = '1.0.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "messages".task_message_read ADD COLUMN message_id uuid;
  ALTER TABLE "messages".task_message_read ADD CONSTRAINT task_message_read_message_id_fk FOREIGN KEY (message_id) REFERENCES "messages".message(id);

  ALTER TABLE "messages".project_message_read ADD COLUMN message_id uuid;
  ALTER TABLE "messages".project_message_read ADD CONSTRAINT project_message_read_message_id_fk FOREIGN KEY (message_id) REFERENCES "messages".message(id);

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

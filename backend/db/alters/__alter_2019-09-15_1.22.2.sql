  --
  -- ALTER: 1.22.2
  -- DATE: 2019-09-15
  -- FEATURES:
  -- * adds notification for inserting message attachments (messages.message_file)
  --


\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.22.1';
DECLARE newVersion text = '1.22.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  DROP TRIGGER IF EXISTS watched_message_file_table_trigger
      ON "messages".message_file;
  CREATE TRIGGER watched_message_file_table_trigger
      AFTER INSERT OR UPDATE OR DELETE
      ON "messages".message_file
      FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('message_id', 'file_id');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;

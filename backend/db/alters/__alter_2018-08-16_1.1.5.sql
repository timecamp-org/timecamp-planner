--
-- ALTER: 1.1.5
-- DATE: 2018-08-16
-- FEATURES: 
-- * Add notification push trigger
-- * Add device type column
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.1.4';
  newVersion text = '1.1.5';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TRIGGER watched_notification_push_trigger
    AFTER INSERT
    ON notifications.notification_push
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('notification_id');

  CREATE TYPE notifications.device_type AS ENUM (
    'browser',
    'desktopApp'
  );

  ALTER TYPE notifications.device_type OWNER TO heyspace;

  ALTER TABLE notifications.notification_push_device
    ADD COLUMN device_type notifications.device_type DEFAULT 'browser'::notifications.device_type NOT NULL;

  UPDATE notifications.notification_push_device SET device_type = 'browser'::notifications.device_type;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
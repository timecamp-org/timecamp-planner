
--
-- ALTER: 1.5.0
-- DATE: 2019-03-29
-- FEATURES:
-- * add mute_all_sounds in notification settings
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.4.4';
  newVersion text = '1.5.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE notifications.notification_delivery_settings ADD COLUMN sound_notifications boolean NOT NULL default true;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;

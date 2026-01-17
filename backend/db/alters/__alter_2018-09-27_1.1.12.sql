--
-- ALTER: 1.1.12
-- DATE: 2018-09-27
-- FEATURES: 
--   - mobile push notifications
--


\set ON_ERROR_STOP on

DO $$
DECLARE   previousVersion text = '1.1.11';

  DECLARE newVersion      text = '1.1.12';

BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion)
  ;

  --
  -- START ALTER (insert statements below)
  --


-- 1. rename the enum type you want to change
alter type notifications.device_type rename to _device_type;
-- 2. create new type
create type notifications.device_type as enum ('browser', 'desktopApp', 'mobile');
-- 3. rename column(s) which uses our enum type
alter table notifications.notification_push_device rename column device_type to _device_type;
-- 4. add new column of new type
alter table notifications.notification_push_device add device_type notifications.device_type DEFAULT 'browser'::notifications.device_type not null;
-- 5. copy values to the new column
update notifications.notification_push_device set device_type = _device_type::text::notifications.device_type;
-- 6. remove old column and type
alter table notifications.notification_push_device drop column _device_type;
drop type notifications._device_type;

alter table notifications.notification_push_device alter column device_id type text;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code)
  VALUES
    (newVersion)
  ;

END $$
;

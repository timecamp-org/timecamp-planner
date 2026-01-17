
--
-- ALTER: 1.13.0
-- DATE: 2019-05-22
-- FEATURES:
-- * add invitations count
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.12.0';
  newVersion text = '1.13.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

-- 1. rename the enum type you want to change
alter type notifications.device_type rename to _device_type;
-- 2. create new type
create type notifications.device_type as enum ('browser', 'desktopApp', 'mobile', 'ios', 'android');
-- 3. rename column(s) which uses our enum type
alter table notifications.notification_push_device rename column device_type to _device_type;
alter table core.user_session rename column device_type to _device_type;
-- 4. add new column of new type
alter table notifications.notification_push_device add device_type notifications.device_type DEFAULT 'browser'::notifications.device_type not null;
alter table core.user_session add device_type notifications.device_type;
-- 5. copy values to the new column
update notifications.notification_push_device set device_type = _device_type::text::notifications.device_type;
update core.user_session set device_type = _device_type::text::notifications.device_type;
-- 6. remove old column and type
alter table notifications.notification_push_device drop column _device_type;
alter table core.user_session drop column _device_type;
drop type notifications._device_type;


  CREATE OR REPLACE VIEW stats.online_android_clients_count_non_timecamp
AS SELECT count(DISTINCT us.user_id) AS online_android_clients_count
   FROM core.user_session us
     JOIN core."user" u ON us.user_id = u.id
  WHERE us.finished_at IS NULL AND u.email !~~ '%timecamp.com'::public.citext AND u.email !~~ '%hey.space'::public.citext AND us.device_type = 'android'::notifications.device_type;

ALTER VIEW stats.online_android_clients_count_non_timecamp OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.online_desktop_clients_count_non_timecamp
AS SELECT count(DISTINCT us.user_id) AS online_desktop_clients_count
   FROM core.user_session us
     JOIN core."user" u ON us.user_id = u.id
  WHERE us.finished_at IS NULL AND u.email !~~ '%timecamp.com'::public.citext AND u.email !~~ '%hey.space'::public.citext AND us.device_type = 'desktopApp'::notifications.device_type;

ALTER VIEW stats.online_desktop_clients_count_non_timecamp OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.online_ios_clients_count_non_timecamp
AS SELECT count(DISTINCT us.user_id) AS online_ios_clients_count
   FROM core.user_session us
     JOIN core."user" u ON us.user_id = u.id
  WHERE us.finished_at IS NULL AND u.email !~~ '%timecamp.com'::public.citext AND u.email !~~ '%hey.space'::public.citext AND us.device_type = 'ios'::notifications.device_type;

ALTER VIEW stats.online_ios_clients_count_non_timecamp OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.online_mobile_clients_count_non_timecamp
AS SELECT count(DISTINCT us.user_id) AS online_mobile_clients_count
   FROM core.user_session us
     JOIN core."user" u ON us.user_id = u.id
  WHERE us.finished_at IS NULL AND u.email !~~ '%timecamp.com'::public.citext AND u.email !~~ '%hey.space'::public.citext AND us.device_type = 'mobile'::notifications.device_type;

ALTER VIEW stats.online_mobile_clients_count_non_timecamp OWNER TO heyspace;

  CREATE OR REPLACE VIEW stats.online_web_clients_count_non_timecamp
AS SELECT count(DISTINCT us.user_id) AS online_web_clients_count
   FROM core.user_session us
     JOIN core."user" u ON us.user_id = u.id
  WHERE us.finished_at IS NULL AND u.email !~~ '%timecamp.com'::public.citext AND u.email !~~ '%hey.space'::public.citext AND us.device_type = 'browser'::notifications.device_type;

ALTER VIEW stats.online_web_clients_count_non_timecamp OWNER TO heyspace;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
